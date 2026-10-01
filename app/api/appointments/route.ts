// ============================================================================
// /api/appointments
// Outpatient appointment scheduling, rescheduling, and cancellation
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/supabase/mock-store';
import { Appointment } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get('patientId');
  const doctorId = searchParams.get('doctorId');

  let list = mockStore.appointments;
  if (patientId) {
    list = list.filter(a => a.patient_id === patientId);
  }
  if (doctorId) {
    list = list.filter(a => a.doctor_id === doctorId);
  }

  return NextResponse.json({ appointments: list });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newId = `apt-${Date.now()}`;
    const doctor = mockStore.doctors.find(d => d.id === body.doctorId) || mockStore.doctors[0];
    const dept = mockStore.departments.find(d => d.id === body.departmentId) || mockStore.departments[0];
    const doctorProfile = mockStore.profiles.find(p => p.id === doctor.profile_id);

    const newApt: Appointment = {
      id: newId,
      patient_id: body.patientId || mockStore.patients[0].id,
      doctor_id: doctor.id,
      department_id: dept.id,
      appointment_date: body.appointmentDate || new Date().toISOString().split('T')[0],
      appointment_time: body.appointmentTime || '14:00',
      status: 'CONFIRMED',
      reason: body.reason || 'General clinical consultation',
      priority: body.priority || 'ROUTINE',
      patient_name: body.patientName || 'Arav Kumar',
      doctor_name: doctorProfile?.full_name || 'Dr. Rajesh Patel, MD',
      department_name: dept.name,
      created_at: new Date().toISOString()
    };

    mockStore.appointments.unshift(newApt);

    // Also auto-generate a queue entry
    const nextQueueNum = 100 + mockStore.queue.length + 1;
    mockStore.queue.push({
      id: `q-${Date.now()}`,
      appointment_id: newId,
      patient_id: newApt.patient_id,
      department_id: dept.id,
      doctor_id: doctor.id,
      queue_number: nextQueueNum,
      status: 'WAITING',
      priority: newApt.priority,
      check_in_time: new Date().toISOString(),
      estimated_wait_minutes: (mockStore.queue.length + 1) * 15,
      patient_name: newApt.patient_name,
      doctor_name: newApt.doctor_name,
      department_name: dept.name
    });

    return NextResponse.json({ appointment: newApt, queueNumber: nextQueueNum }, { status: 201 });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const apt = mockStore.appointments.find(a => a.id === body.id);
    if (!apt) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (body.status) apt.status = body.status;
    if (body.appointment_date) apt.appointment_date = body.appointment_date;
    if (body.appointment_time) apt.appointment_time = body.appointment_time;
    if (body.priority) apt.priority = body.priority;

    return NextResponse.json({ appointment: apt });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
