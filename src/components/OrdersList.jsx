
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, CheckCircle } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const OrdersList = ({ orders, showStudentDetails = false }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gray-500';
      case 'picked-up': return 'bg-orange-500';
      case 'in-process': return 'bg-yellow-500';
      case 'washing-complete': return 'bg-green-500';
      case 'delivered': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
          <p className="text-gray-500">You don't have any laundry orders yet.</p>
        </div>
      ) : (
        orders.map(order => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 pb-2">
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <Package className="h-5 w-5 mr-2 text-blue-600" />
                    {order.id}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                </div>
                <Badge className={`${getStatusColor(order.status)} text-white capitalize`}>
                  {order.status.replace('-', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {showStudentDetails && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Student Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-500">Name:</span> {order.studentName}</div>
                    <div><span className="text-gray-500">Roll Number:</span> {order.rollNumber}</div>
                    <div><span className="text-gray-500">Hostel:</span> {order.hostel}</div>
                    <div><span className="text-gray-500">Floor:</span> {order.floor}</div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium mb-2">Order Summary</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Items</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium capitalize">
                            {item.serviceType.replace('+', ' + ')}
                          </TableCell>
                          <TableCell>
                            <ul className="list-disc list-inside">
                              {item.items.map(({ item: clothingItem, qty }) => (
                                <li key={clothingItem} className="capitalize">
                                  {clothingItem} x {qty}
                                </li>
                              ))}
                            </ul>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {order.status === 'delivered' && (
                <div className="mt-4 p-3 bg-green-50 rounded-md text-green-700 text-sm flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Your laundry has been delivered.</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrdersList;
