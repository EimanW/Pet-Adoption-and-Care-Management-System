/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Stethoscope, CheckCircle } from "lucide-react";
import petIcon from "@/assets/pet-icon.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  image_url: string | null;
}

interface Appointment {
  id: string;
  pet_id: string;
  appointment_date: string;
  appointment_type: string;
  status: string;
  reason: string;
  notes: string | null;
  pets: Pet | null;
  profiles: { first_name: string; last_name: string; email: string } | null;
}

const VetPortal = () => {
  const { toast } = useToast();
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (userRole !== "vet") {
      toast({
        title: "Access Denied",
        description: "You dont have veterinarian privileges.",
        variant: "destructive"
      });
      navigate("/");
      return;
    }
    fetchAppointments();
  }, [user, userRole, navigate]);

  const fetchAppointments = async () => {
    try {
      // Fetch appointments without joins
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("vet_appointments")
        .select("*")
        .order("appointment_date", { ascending: false });
      
      if (appointmentsError) throw appointmentsError;

      // Fetch related data separately
      const appointmentsWithDetails = await Promise.all(
        (appointmentsData || []).map(async (apt) => {
          // Fetch pet details
          const { data: petData } = await supabase
            .from("pets")
            .select("id, name, species, breed, age, image_url")
            .eq("id", apt.pet_id)
            .single();

          // Fetch user profile details
          const { data: profileData } = await supabase
            .from("profiles")
            .select("first_name, last_name, email")
            .eq("id", apt.user_id)
            .single();

          return {
            ...apt,
            pets: petData,
            profiles: profileData
          };
        })
      );

      setAppointments(appointmentsWithDetails as unknown as Appointment[]);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("vet_appointments")
        .update({ status: newStatus })
        .eq("id", appointmentId);

      if (error) throw error;

      toast({ title: "Success", description: `Appointment marked as ${newStatus}` });
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({ title: "Error", description: "Failed to update appointment", variant: "destructive" });
    }
  };

  const scheduledAppointments = appointments.filter(a => a.status === "scheduled");
  const completedAppointments = appointments.filter(a => a.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={petIcon} alt="PawHaven" className="h-10 w-10" />
            <div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                PawHaven Vet Portal
              </span>
              <p className="text-xs text-muted-foreground">Veterinarian Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">View Site</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Scheduled Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Pending appointments</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-accent" />
                Completed Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointments
            </CardTitle>
            <CardDescription>Manage scheduled and completed appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p className="text-muted-foreground">No appointments found</p>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-start justify-between p-4 rounded-lg border border-border">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{apt.pets?.name || "Unknown Pet"}</p>
                        <Badge variant={apt.status === "completed" ? "default" : apt.status === "scheduled" ? "secondary" : "outline"}>
                          {apt.status}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {apt.appointment_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Owner: {apt.profiles?.first_name} {apt.profiles?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(apt.appointment_date).toLocaleString()}
                      </p>
                      <p className="text-sm">Reason: {apt.reason}</p>
                      {apt.notes && (
                        <p className="text-xs text-muted-foreground">Notes: {apt.notes}</p>
                      )}
                    </div>
                    {apt.status === "scheduled" && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleAppointmentStatusUpdate(apt.id, "completed")}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VetPortal;
