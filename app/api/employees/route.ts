

import Employee from '@/models/employee';
import { connectDB } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from '@/lib/auth';



export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
 

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName, email, phone, role } = await request.json();

    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return NextResponse.json({ message: "Email already exists" }, { status: 409 });
    }

    console.log("session", session);
    

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phone,
      role,
      createdBy: (session?.user as { id: string }).id
    });

    await newEmployee.save();

    return NextResponse.json(
      { message: "Employee created successfully", employee: newEmployee },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const employees = await Employee.find({ createdBy: (session?.user as { id: string }).id });

    return NextResponse.json({ employees }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { employeeId, firstName, lastName, phone } = await request.json();
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }
    if (employee.createdBy.toString() !== (session?.user as { id: string }).id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    employee.firstName = firstName || employee.firstName;
    employee.lastName = lastName || employee.lastName;
    employee.phone = phone || employee.phone;

    await employee.save();

    return NextResponse.json({ message: "Employee updated successfully", employee }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { employeeId } = await request.json();
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }
    if (employee.createdBy.toString() !== (session?.user as { id: string }).id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await employee.deleteOne();

    return NextResponse.json({ message: "Employee deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
