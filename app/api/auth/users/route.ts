import Employee from '@/models/employee';
import { connectDB } from '@/lib/mongodb';
import { getSession } from 'next-auth/react';
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";


export async function POST(request: Request) {
  try {
    await connectDB();

    const { name, email, password, phone } = await request.json();

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const EmployeeFound = await Employee.findOne({ email });

    if (EmployeeFound) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const Employee = new Employee({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    const savedEmployee = await Employee.save();

    return NextResponse.json(
      {
        name: savedEmployee.name,
        email: savedEmployee.email,
        createdAt: savedEmployee.createdAt,
        updatedAt: savedEmployee.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      console.error("Error during signup:", error);
      return NextResponse.error();
    }
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();

    const { EmployeeId, name, email, password, phone, address } =
      await request.json();

    if (password && password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const EmployeeToUpdate = await Employee.findById(EmployeeId);

    if (!EmployeeToUpdate) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    if (name) {
      EmployeeToUpdate.name = name;
    }

    if (email) {
      EmployeeToUpdate.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      EmployeeToUpdate.password = hashedPassword;
    }

    if (phone) {
      EmployeeToUpdate.phone = phone;
    }

    if (address) {
      EmployeeToUpdate.address = address;
    }

    await EmployeeToUpdate.save();

    console.log(EmployeeToUpdate);

    return NextResponse.json(
      {
        message: "Employee updated successfully",
        updatedEmployee: {
          id: EmployeeToUpdate._id,
          name: EmployeeToUpdate.name,
          email: EmployeeToUpdate.email,
          createdAt: EmployeeToUpdate.createdAt,
          updatedAt: EmployeeToUpdate.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      console.error("Error during Employee update:", error);
      return NextResponse.error();
    }
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();

    const { EmployeeId } = await request.json();

    const Employee = await Employee.findById(EmployeeId);

    if (!Employee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    await Employee.remove();

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during Employee/cart item deletion:", error);
    return NextResponse.error();
  }
}
