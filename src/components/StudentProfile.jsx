
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const StudentProfile = ({ student }) => {
  // Calculate the percentage of washes used
  const washPercentage = (student.washesUsed / 40) * 100;
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-blue-700">Student Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-4 w-2/3">
            <div>
              <p className="text-sm text-gray-500">Application Number</p>
              <p className="font-medium">{student.applicationNumber}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{student.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium">{student.gender}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{student.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Tower</p>
              <p className="font-medium">{student.tower}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Floor</p>
              <p className="font-medium">{student.floor}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{student.phone}</p>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium">Washes Used: {student.washesUsed} / 40</p>
                <p className="text-xs text-gray-500">{washPercentage.toFixed(0)}%</p>
              </div>
              <Progress value={washPercentage} className="h-2" />
              {student.washesUsed >= 40 && (
                <p className="text-xs text-red-500 mt-1">You have used all your allocated washes.</p>
              )}
            </div>
          </div>
          
          <div className="w-1/3 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
              {student.profileImage ? (
                <img 
                  src={student.profileImage} 
                  alt={student.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                  {student.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProfile;
