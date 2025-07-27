// src/app/(dashboard)/dashboard/admin/users/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { apiClient } from '@/lib/api'
import { User, UserRole } from '@/types'
import { ROLE_LABELS } from '@/constants'
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Filter,
  Ban,
  UserCheck,
  Trash2,
  Users as UsersIcon
} from 'lucide-react'
import { toast } from 'sonner'

export default function UsersManagement() {
  // Initialize with empty arrays to prevent undefined errors
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    type: 'status' | 'role' | 'delete'
    user: User | null
    newValue?: string
  }>({
    open: false,
    type: 'status',
    user: null,
    newValue: ''
  })
  const [actionReason, setActionReason] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [currentPage, selectedRole, selectedStatus, searchTerm])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params: any = {
        page: currentPage,
        limit: 10
      }
      
      if (selectedRole !== 'all') params.role = selectedRole
      if (selectedStatus !== 'all') params.status = selectedStatus
      if (searchTerm) params.search = searchTerm

      const response = await apiClient.users.getUsers(params)
      
      // Ensure we always set an array
      setUsers(response?.data || [])
      setTotalPages(response?.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to fetch users')
      // Set empty array on error
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await apiClient.users.updateUserStatus(userId, newStatus, actionReason)
      toast.success(`User status updated to ${newStatus}`)
      fetchUsers()
      setActionDialog({ open: false, type: 'status', user: null })
      setActionReason('')
    } catch (error) {
      console.error('Failed to update user status:', error)
      toast.error('Failed to update user status')
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiClient.users.updateUserRole(userId, newRole, actionReason)
      toast.success(`User role updated to ${newRole}`)
      fetchUsers()
      setActionDialog({ open: false, type: 'role', user: null })
      setActionReason('')
    } catch (error) {
      console.error('Failed to update user role:', error)
      toast.error('Failed to update user role')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await apiClient.users.deleteUser(userId)
      toast.success('User deleted successfully')
      fetchUsers()
      setActionDialog({ open: false, type: 'delete', user: null })
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Failed to delete user')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: { variant: 'default', className: 'bg-green-100 text-green-800' },
      suspended: { variant: 'destructive' },
      pending: { variant: 'secondary' }
    }
    return <Badge {...(variants[status] || variants.pending)}>{status}</Badge>
  }

  const getVerificationStatus = (user: User) => {
    const verified = user?.verification?.emailVerified && user?.verification?.phoneVerified
    return verified ? (
      <Badge className="bg-green-100 text-green-800">Verified</Badge>
    ) : (
      <Badge variant="secondary">Pending</Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage all system users</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email, name, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="bus_owner">Bus Owner</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="conductor">Conductor</SelectItem>
                <SelectItem value="passenger">Passenger</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Users ({users?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : users?.length === 0 ? (
            <div className="text-center py-8">
              <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user?.profile?.firstName || 'N/A'} {user?.profile?.lastName || ''}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user?.email || 'N/A'}
                        </div>
                        {user?.profile?.phone && (
                          <div className="text-sm text-muted-foreground">
                            {user.profile.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {ROLE_LABELS[user?.role as keyof typeof ROLE_LABELS] || user?.role || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(user?.status || 'pending')}</TableCell>
                    <TableCell>{getVerificationStatus(user)}</TableCell>
                    <TableCell>
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setActionDialog({
                              open: true,
                              type: 'status',
                              user,
                              newValue: user.status
                            })}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Change Status
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setActionDialog({
                              open: true,
                              type: 'role',
                              user,
                              newValue: user.role
                            })}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setActionDialog({
                              open: true,
                              type: 'delete',
                              user
                            })}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog 
        open={actionDialog.open} 
        onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'status' && 'Change User Status'}
              {actionDialog.type === 'role' && 'Change User Role'}
              {actionDialog.type === 'delete' && 'Delete User'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === 'delete' 
                ? 'This action cannot be undone. This will permanently delete the user account.'
                : 'Please provide a reason for this action.'
              }
            </DialogDescription>
          </DialogHeader>

          {actionDialog.type === 'status' && (
            <div className="space-y-4">
              <Select 
                defaultValue={actionDialog.user?.status}
                onValueChange={(value) => setActionDialog(prev => ({ ...prev, newValue: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Reason for status change..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
          )}

          {actionDialog.type === 'role' && (
            <div className="space-y-4">
              <Select 
                defaultValue={actionDialog.user?.role}
                onValueChange={(value) => setActionDialog(prev => ({ ...prev, newValue: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="bus_owner">Bus Owner</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="conductor">Conductor</SelectItem>
                  <SelectItem value="passenger">Passenger</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Reason for role change..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ open: false, type: 'status', user: null })}
            >
              Cancel
            </Button>
            <Button
              variant={actionDialog.type === 'delete' ? 'destructive' : 'default'}
              onClick={() => {
                if (actionDialog.type === 'status' && actionDialog.newValue) {
                  handleStatusChange(actionDialog.user!._id, actionDialog.newValue)
                } else if (actionDialog.type === 'role' && actionDialog.newValue) {
                  handleRoleChange(actionDialog.user!._id, actionDialog.newValue)
                } else if (actionDialog.type === 'delete') {
                  handleDeleteUser(actionDialog.user!._id)
                }
              }}
            >
              {actionDialog.type === 'delete' ? 'Delete' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}