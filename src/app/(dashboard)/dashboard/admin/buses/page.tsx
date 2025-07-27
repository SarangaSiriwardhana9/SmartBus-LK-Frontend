/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api";
import { Bus } from "@/types";
import {
  Search,
  MoreHorizontal,
  Bus as BusIcon,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export default function BusManagement() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [detailsDialog, setDetailsDialog] = useState(false);

  useEffect(() => {
    fetchBuses();
  }, [currentPage, selectedStatus, selectedType, searchTerm]);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (selectedStatus !== "all") params.status = selectedStatus;
      if (selectedType !== "all") params.busType = selectedType;
      if (searchTerm) params.search = searchTerm;

      const response = await apiClient.buses.getBuses(params);
      setBuses(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch buses:", error);
      toast.error("Failed to fetch buses");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBus = async (busId: string) => {
    try {
      await apiClient.buses.approveBus(busId);
      toast.success("Bus approved successfully");
      fetchBuses();
    } catch (error) {
      console.error("Failed to approve bus:", error);
      toast.error("Failed to approve bus");
    }
  };

  const handleRejectBus = async (busId: string) => {
    try {
      await apiClient.buses.rejectBus(busId);
      toast.success("Bus rejected successfully");
      fetchBuses();
    } catch (error) {
      console.error("Failed to reject bus:", error);
      toast.error("Failed to reject bus");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: { variant: "default", className: "bg-green-100 text-green-800" },
      inactive: { variant: "secondary" },
      maintenance: {
        variant: "destructive",
        className: "bg-yellow-100 text-yellow-800",
      },
      pending: { variant: "outline" },
    };
    return <Badge {...variants[status]}>{status}</Badge>;
  };

  const getBusTypeBadge = (type: string) => {
    const variants: Record<string, any> = {
      ac: { className: "bg-blue-100 text-blue-800" },
      "non-ac": { className: "bg-gray-100 text-gray-800" },
      "semi-luxury": { className: "bg-purple-100 text-purple-800" },
      luxury: { className: "bg-gold-100 text-gold-800" },
    };
    return <Badge {...variants[type]}>{type.toUpperCase()}</Badge>;
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Bus Management</h1>
        <p className='text-muted-foreground'>Manage all registered buses</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search by registration number, make, or model...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-8'
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='All Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
                <SelectItem value='maintenance'>Maintenance</SelectItem>
                <SelectItem value='pending'>Pending Approval</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='All Types' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Types</SelectItem>
                <SelectItem value='ac'>AC</SelectItem>
                <SelectItem value='non-ac'>Non-AC</SelectItem>
                <SelectItem value='semi-luxury'>Semi-Luxury</SelectItem>
                <SelectItem value='luxury'>Luxury</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Buses Table */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BusIcon className='h-5 w-5' />
            Buses ({buses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='space-y-2'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='h-16 bg-muted animate-pulse rounded' />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bus Details</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buses.map((bus) => (
                  <TableRow key={bus._id}>
                    <TableCell>
                      <div>
                        <div className='font-medium'>
                          {bus.registrationNumber}
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          {bus.busDetails.make} {bus.busDetails.model} (
                          {bus.busDetails.year})
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getBusTypeBadge(bus.specifications.busType)}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <Users className='h-4 w-4' />
                        {bus.specifications.totalSeats} seats
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(bus.status)}</TableCell>
                    <TableCell>
                      <div className='text-sm'>
                        Owner ID: {bus.ownerId.slice(-8)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
                        {new Date(bus.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedBus(bus);
                              setDetailsDialog(true);
                            }}
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            View Details
                          </DropdownMenuItem>
                          {bus.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleApproveBus(bus._id)}
                                className='text-green-600'
                              >
                                <CheckCircle className='mr-2 h-4 w-4' />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRejectBus(bus._id)}
                                className='text-red-600'
                              >
                                <XCircle className='mr-2 h-4 w-4' />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
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
            <div className='flex items-center justify-between pt-4'>
              <div className='text-sm text-muted-foreground'>
                Page {currentPage} of {totalPages}
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                >
                  Previous
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bus Details Dialog */}
      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
            <DialogTitle>Bus Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected bus
            </DialogDescription>
          </DialogHeader>

          {selectedBus && (
            <div className='grid gap-6'>
              {/* Basic Info */}
              <div className='grid md:grid-cols-2 gap-4'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <div>
                      <span className='font-medium'>Registration:</span>{" "}
                      {selectedBus.registrationNumber}
                    </div>
                    <div>
                      <span className='font-medium'>Make:</span>{" "}
                      {selectedBus.busDetails.make}
                    </div>
                    <div>
                      <span className='font-medium'>Model:</span>{" "}
                      {selectedBus.busDetails.model}
                    </div>
                    <div>
                      <span className='font-medium'>Year:</span>{" "}
                      {selectedBus.busDetails.year}
                    </div>
                    <div>
                      <span className='font-medium'>Engine:</span>{" "}
                      {selectedBus.busDetails.engineNumber}
                    </div>
                    <div>
                      <span className='font-medium'>Chassis:</span>{" "}
                      {selectedBus.busDetails.chassisNumber}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <div>
                      <span className='font-medium'>Type:</span>{" "}
                      {getBusTypeBadge(selectedBus.specifications.busType)}
                    </div>
                    <div>
                      <span className='font-medium'>Total Seats:</span>{" "}
                      {selectedBus.specifications.totalSeats}
                    </div>
                    <div>
                      <span className='font-medium'>Status:</span>{" "}
                      {getStatusBadge(selectedBus.status)}
                    </div>
                    <div>
                      <span className='font-medium'>Facilities:</span>
                      <div className='flex flex-wrap gap-1 mt-1'>
                        {selectedBus.specifications.facilities.map(
                          (facility) => (
                            <Badge
                              key={facility}
                              variant='outline'
                              className='text-xs'
                            >
                              {facility}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Seat Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Seat Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid md:grid-cols-3 gap-4'>
                    <div>
                      <span className='font-medium'>Layout:</span>{" "}
                      {selectedBus.seatConfiguration.layoutType}
                    </div>
                    <div>
                      <span className='font-medium'>Rows:</span>{" "}
                      {selectedBus.seatConfiguration.totalRows}
                    </div>
                    <div>
                      <span className='font-medium'>Seats per Row:</span>{" "}
                      {selectedBus.seatConfiguration.seatsPerRow}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              {selectedBus.images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid md:grid-cols-3 gap-4'>
                      {selectedBus.images.slice(0, 6).map((image, index) => (
                        <div
                          key={index}
                          className='aspect-video bg-muted rounded-lg flex items-center justify-center'
                        >
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/upload/files/${image}`}
                            alt={`Bus image ${index + 1}`}
                            className='w-full h-full object-cover rounded-lg'
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
