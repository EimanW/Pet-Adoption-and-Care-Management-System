/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calendar, FileText, MessageSquare, Pill, Stethoscope, Video, Plus, CheckCircle, Clock } from "lucide-react";
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

interface MedicalRecord {
  id: string;
  pet_id: string;
  record_type: string;
  description: string;
  date: string;
  veterinarian: string | null;
  notes: string | null;
  created_at: string;
  pets: Pet | null;
}

interface Vaccination {
  id: string;
  pet_id: string;
  vaccine_name: string;
  date_administered: string;
  next_due_date: string | null;
  veterinarian: string | null;
  notes: string | null;
  pets: Pet | null;
}

interface Prescription {
  id: string;
  pet_id: string;
  medication_name: string;
  dosage: string;
  instructions: string;
  prescribed_date: string;
  veterinarian_id: string;
  veterinarian_name: string | null;
  pets: Pet | null;
}

interface Consultation {
  id: string;
  pet_id: string;
  user_id: string;
  vet_id: string | null;
  status: string;
  requested_date: string;
  scheduled_date: string | null;
  consultation_type: string;
  notes: string | null;
  pets: Pet | null;
  profiles: { first_name: string; last_name: string; email: string } | null;
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
  const [pets, setPets] = useState<Pet[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [medicalDialogOpen, setMedicalDialogOpen] = useState(false);
  const [vaccinationDialogOpen, setVaccinationDialogOpen] = useState(false);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  
  const [medicalFormData, setMedicalFormData] = useState({
    record_type: 'checkup',
    description: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [vaccinationFormData, setVaccinationFormData] = useState({
    vaccine_name: '',
    date_administered: new Date().toISOString().split('T')[0],
    next_due_date: '',
    notes: ''
  });

  const [prescriptionFormData, setPrescriptionFormData] = useState({
    medication_name: '',
    dosage: '',
    instructions: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (userRole !== 'vet') {
      toast({
        title: "Access Denied",
        description: "You don't have veterinarian privileges.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userRole, navigate]);

  const fetchAllData = async () => {
    await Promise.all([
      fetchPets(),
      fetchMedicalRecords(),
      fetchVaccinations(),
      fetchPrescriptions(),
      fetchConsultations(),
      fetchAppointments()
    ]);
    setLoading(false);
  };

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('id, name, species, breed, age, image_url')
        .order('name');
      
      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          *,
          pets (id, name, species, breed, age, image_url)
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      setMedicalRecords(data as unknown as MedicalRecord[] || []);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  const fetchVaccinations = async () => {
    try {
      const { data, error } = await supabase
        .from('vaccinations')
        .select(`
          *,
          pets (id, name, species, breed, age, image_url)
        `)
        .order('date_administered', { ascending: false });
      
      if (error) throw error;
      setVaccinations(data as unknown as Vaccination[] || []);
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          pets (id, name, species, breed, age, image_url)
        `)
        .order('prescribed_date', { ascending: false });
      
      if (error) throw error;
      setPrescriptions(data as unknown as Prescription[] || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const fetchConsultations = async () => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          pets (id, name, species, breed, age, image_url),
          profiles (first_name, last_name, email)
        `)
        .order('requested_date', { ascending: false });
      
      if (error) throw error;
      setConsultations(data as unknown as Consultation[] || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('vet_appointments')
        .select(`
          *,
          pets (id, name, species, breed, age, image_url),
          profiles (first_name, last_name, email)
        `)
        .order('appointment_date', { ascending: false });
      
      if (error) throw error;
      setAppointments(data as unknown as Appointment[] || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleAddMedicalRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) {
      toast({ title: "Error", description: "Please select a pet", variant: "destructive" });
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user!.id)
        .single();

      const veterinarian = profile ? `Dr. ${profile.first_name} ${profile.last_name}` : 'Unknown';

      const { error } = await supabase
        .from('medical_records')
        .insert({
          pet_id: selectedPet,
          record_type: medicalFormData.record_type,
          description: medicalFormData.description,
          date: medicalFormData.date,
          veterinarian: veterinarian,
          notes: medicalFormData.notes
        });

      if (error) throw error;

      toast({ title: "Success", description: "Medical record added successfully" });
      setMedicalDialogOpen(false);
      setMedicalFormData({
        record_type: 'checkup',
        description: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      fetchMedicalRecords();
    } catch (error) {
      console.error('Error adding medical record:', error);
      toast({ title: "Error", description: "Failed to add medical record", variant: "destructive" });
    }
  };

  const handleAddVaccination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) {
      toast({ title: "Error", description: "Please select a pet", variant: "destructive" });
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user!.id)
        .single();

      const veterinarian = profile ? `Dr. ${profile.first_name} ${profile.last_name}` : 'Unknown';

      const { error } = await supabase
        .from('vaccinations')
        .insert({
          pet_id: selectedPet,
          vaccine_name: vaccinationFormData.vaccine_name,
          date_administered: vaccinationFormData.date_administered,
          next_due_date: vaccinationFormData.next_due_date || null,
          veterinarian: veterinarian,
          notes: vaccinationFormData.notes
        });

      if (error) throw error;

      toast({ title: "Success", description: "Vaccination record added successfully" });
      setVaccinationDialogOpen(false);
      setVaccinationFormData({
        vaccine_name: '',
        date_administered: new Date().toISOString().split('T')[0],
        next_due_date: '',
        notes: ''
      });
      fetchVaccinations();
    } catch (error) {
      console.error('Error adding vaccination:', error);
      toast({ title: "Error", description: "Failed to add vaccination record", variant: "destructive" });
    }
  };

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) {
      toast({ title: "Error", description: "Please select a pet", variant: "destructive" });
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user!.id)
        .single();

      const veterinarianName = profile ? `Dr. ${profile.first_name} ${profile.last_name}` : 'Unknown';

      const { error } = await supabase
        .from('prescriptions')
        .insert({
          pet_id: selectedPet,
          medication_name: prescriptionFormData.medication_name,
          dosage: prescriptionFormData.dosage,
          instructions: prescriptionFormData.instructions,
          prescribed_date: new Date().toISOString().split('T')[0],
          veterinarian_id: user!.id,
          veterinarian_name: veterinarianName
        });

      if (error) throw error;

      toast({ title: "Success", description: "Prescription added successfully" });
      setPrescriptionDialogOpen(false);
      setPrescriptionFormData({
        medication_name: '',
        dosage: '',
        instructions: ''
      });
      fetchPrescriptions();
    } catch (error) {
      console.error('Error adding prescription:', error);
      toast({ title: "Error", description: "Failed to add prescription", variant: "destructive" });
    }
  };

  const handleConsultationAction = async (consultationId: string, action: 'accept' | 'reject', scheduledDate?: string) => {
    try {
      const updates: { status: string; vet_id?: string; scheduled_date?: string } = {
        status: action === 'accept' ? 'scheduled' : 'rejected'
      };
      
      if (action === 'accept') {
        updates.vet_id = user!.id;
        if (scheduledDate) updates.scheduled_date = scheduledDate;
      }

      const { error } = await supabase
        .from('consultations')
        .update(updates)
        .eq('id', consultationId);

      if (error) throw error;

      toast({ 
        title: "Success", 
        description: `Consultation ${action === 'accept' ? 'accepted' : 'rejected'} successfully` 
      });
      fetchConsultations();
    } catch (error) {
      console.error('Error updating consultation:', error);
      toast({ title: "Error", description: "Failed to update consultation", variant: "destructive" });
    }
  };

  const handleAppointmentStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('vet_appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({ title: "Success", description: "Appointment status updated" });
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({ title: "Error", description: "Failed to update appointment", variant: "destructive" });
    }
  };

  const pendingConsultations = consultations.filter(c => c.status === 'pending');
  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');

  return (
    <div className="min-h-screen bg-background">
      {/* Vet Header */}
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
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Pending Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingConsultations.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-accent" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-secondary" />
                Medical Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{medicalRecords.length}</div>
              <p className="text-xs text-muted-foreground">Total records</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Pill className="h-4 w-4 text-health" />
                Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prescriptions.length}</div>
              <p className="text-xs text-muted-foreground">Active prescriptions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="consultations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="medical">Medical Records</TabsTrigger>
            <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>

          {/* Consultations Tab */}
          <TabsContent value="consultations" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Online Consultations
                </CardTitle>
                <CardDescription>Manage consultation requests from pet owners</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading consultations...</p>
                ) : consultations.length === 0 ? (
                  <p className="text-muted-foreground">No consultation requests yet</p>
                ) : (
                  <div className="space-y-4">
                    {consultations.map((consultation) => (
                      <div key={consultation.id} className="flex items-start justify-between p-4 rounded-lg border border-border">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{consultation.pets?.name || 'Unknown Pet'}</p>
                            <Badge variant={
                              consultation.status === 'pending' ? 'secondary' :
                              consultation.status === 'scheduled' ? 'default' :
                              'outline'
                            }>
                              {consultation.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {consultation.consultation_type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Owner: {consultation.profiles?.first_name} {consultation.profiles?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Requested: {new Date(consultation.requested_date).toLocaleDateString()}
                          </p>
                          {consultation.scheduled_date && (
                            <p className="text-sm text-muted-foreground">
                              Scheduled: {new Date(consultation.scheduled_date).toLocaleString()}
                            </p>
                          )}
                          {consultation.notes && (
                            <p className="text-sm">{consultation.notes}</p>
                          )}
                        </div>
                        {consultation.status === 'pending' && (
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="default">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Accept
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Schedule Consultation</DialogTitle>
                                  <DialogDescription>
                                    Set a date and time for this consultation
                                  </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={(e) => {
                                  e.preventDefault();
                                  const formData = new FormData(e.currentTarget);
                                  const scheduledDate = formData.get('scheduled_date') as string;
                                  handleConsultationAction(consultation.id, 'accept', scheduledDate);
                                }}>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="scheduled_date">Scheduled Date & Time</Label>
                                      <Input
                                        id="scheduled_date"
                                        name="scheduled_date"
                                        type="datetime-local"
                                        required
                                      />
                                    </div>
                                    <Button type="submit" className="w-full">Confirm & Accept</Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleConsultationAction(consultation.id, 'reject')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {consultation.status === 'scheduled' && (
                          <Button size="sm" variant="default" asChild>
                            <a href={`/consultation/${consultation.id}`}>
                              <Video className="h-3 w-3 mr-1" />
                              Join Session
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Veterinary Appointments
                </CardTitle>
                <CardDescription>View and manage scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading appointments...</p>
                ) : appointments.length === 0 ? (
                  <p className="text-muted-foreground">No appointments scheduled</p>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="flex items-start justify-between p-4 rounded-lg border border-border">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{apt.pets?.name || 'Unknown Pet'}</p>
                            <Badge variant={apt.status === 'completed' ? 'default' : 'secondary'}>
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
                        {apt.status === 'scheduled' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleAppointmentStatusUpdate(apt.id, 'completed')}
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
          </TabsContent>

          {/* Medical Records Tab */}
          <TabsContent value="medical" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Medical Records
                    </CardTitle>
                    <CardDescription>Add and manage pet medical records</CardDescription>
                  </div>
                  <Dialog open={medicalDialogOpen} onOpenChange={setMedicalDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Record
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Medical Record</DialogTitle>
                        <DialogDescription>
                          Add a new medical record for a pet
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddMedicalRecord}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="pet">Select Pet</Label>
                            <Select value={selectedPet} onValueChange={setSelectedPet} required>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a pet" />
                              </SelectTrigger>
                              <SelectContent>
                                {pets.map((pet) => (
                                  <SelectItem key={pet.id} value={pet.id}>
                                    {pet.name} - {pet.species}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="record_type">Record Type</Label>
                            <Select 
                              value={medicalFormData.record_type}
                              onValueChange={(value) => setMedicalFormData({...medicalFormData, record_type: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="checkup">Checkup</SelectItem>
                                <SelectItem value="treatment">Treatment</SelectItem>
                                <SelectItem value="surgery">Surgery</SelectItem>
                                <SelectItem value="test">Test Results</SelectItem>
                                <SelectItem value="emergency">Emergency</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={medicalFormData.description}
                              onChange={(e) => setMedicalFormData({...medicalFormData, description: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={medicalFormData.date}
                              onChange={(e) => setMedicalFormData({...medicalFormData, date: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                              id="notes"
                              value={medicalFormData.notes}
                              onChange={(e) => setMedicalFormData({...medicalFormData, notes: e.target.value})}
                            />
                          </div>
                          <Button type="submit" className="w-full">Add Record</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading records...</p>
                ) : medicalRecords.length === 0 ? (
                  <p className="text-muted-foreground">No medical records yet</p>
                ) : (
                  <div className="space-y-4">
                    {medicalRecords.map((record) => (
                      <div key={record.id} className="p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold">{record.pets?.name || 'Unknown Pet'}</p>
                          <Badge variant="outline" className="capitalize">{record.record_type}</Badge>
                        </div>
                        <p className="text-sm mb-1">{record.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Date: {new Date(record.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Veterinarian: {record.veterinarian || 'Unknown'}
                        </p>
                        {record.notes && (
                          <p className="text-xs text-muted-foreground mt-2">Notes: {record.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vaccinations Tab */}
          <TabsContent value="vaccinations" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Vaccination Records
                    </CardTitle>
                    <CardDescription>Manage pet vaccination history</CardDescription>
                  </div>
                  <Dialog open={vaccinationDialogOpen} onOpenChange={setVaccinationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Vaccination
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Vaccination Record</DialogTitle>
                        <DialogDescription>
                          Upload vaccination history for a pet
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddVaccination}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="pet">Select Pet</Label>
                            <Select value={selectedPet} onValueChange={setSelectedPet} required>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a pet" />
                              </SelectTrigger>
                              <SelectContent>
                                {pets.map((pet) => (
                                  <SelectItem key={pet.id} value={pet.id}>
                                    {pet.name} - {pet.species}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="vaccine_name">Vaccine Name</Label>
                            <Input
                              id="vaccine_name"
                              value={vaccinationFormData.vaccine_name}
                              onChange={(e) => setVaccinationFormData({...vaccinationFormData, vaccine_name: e.target.value})}
                              placeholder="e.g., Rabies, DHPP"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="date_administered">Date Administered</Label>
                            <Input
                              id="date_administered"
                              type="date"
                              value={vaccinationFormData.date_administered}
                              onChange={(e) => setVaccinationFormData({...vaccinationFormData, date_administered: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="next_due_date">Next Due Date</Label>
                            <Input
                              id="next_due_date"
                              type="date"
                              value={vaccinationFormData.next_due_date}
                              onChange={(e) => setVaccinationFormData({...vaccinationFormData, next_due_date: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="vac_notes">Notes</Label>
                            <Textarea
                              id="vac_notes"
                              value={vaccinationFormData.notes}
                              onChange={(e) => setVaccinationFormData({...vaccinationFormData, notes: e.target.value})}
                            />
                          </div>
                          <Button type="submit" className="w-full">Add Vaccination</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading vaccinations...</p>
                ) : vaccinations.length === 0 ? (
                  <p className="text-muted-foreground">No vaccination records yet</p>
                ) : (
                  <div className="space-y-4">
                    {vaccinations.map((vac) => (
                      <div key={vac.id} className="p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold">{vac.pets?.name || 'Unknown Pet'}</p>
                          <Badge variant="default">{vac.vaccine_name}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Administered: {new Date(vac.date_administered).toLocaleDateString()}
                        </p>
                        {vac.next_due_date && (
                          <p className="text-sm text-muted-foreground">
                            Next Due: {new Date(vac.next_due_date).toLocaleDateString()}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Veterinarian: {vac.veterinarian || 'Unknown'}
                        </p>
                        {vac.notes && (
                          <p className="text-xs text-muted-foreground mt-2">Notes: {vac.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="h-5 w-5" />
                      Prescriptions
                    </CardTitle>
                    <CardDescription>Prescribe medications for pets</CardDescription>
                  </div>
                  <Dialog open={prescriptionDialogOpen} onOpenChange={setPrescriptionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Prescription
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Prescription</DialogTitle>
                        <DialogDescription>
                          Prescribe medication for a pet
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddPrescription}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="pet">Select Pet</Label>
                            <Select value={selectedPet} onValueChange={setSelectedPet} required>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a pet" />
                              </SelectTrigger>
                              <SelectContent>
                                {pets.map((pet) => (
                                  <SelectItem key={pet.id} value={pet.id}>
                                    {pet.name} - {pet.species}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="medication_name">Medication Name</Label>
                            <Input
                              id="medication_name"
                              value={prescriptionFormData.medication_name}
                              onChange={(e) => setPrescriptionFormData({...prescriptionFormData, medication_name: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="dosage">Dosage</Label>
                            <Input
                              id="dosage"
                              value={prescriptionFormData.dosage}
                              onChange={(e) => setPrescriptionFormData({...prescriptionFormData, dosage: e.target.value})}
                              placeholder="e.g., 10mg twice daily"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="instructions">Instructions</Label>
                            <Textarea
                              id="instructions"
                              value={prescriptionFormData.instructions}
                              onChange={(e) => setPrescriptionFormData({...prescriptionFormData, instructions: e.target.value})}
                              placeholder="Additional instructions for the pet owner"
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full">Add Prescription</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading prescriptions...</p>
                ) : prescriptions.length === 0 ? (
                  <p className="text-muted-foreground">No prescriptions yet</p>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div key={prescription.id} className="p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold">{prescription.pets?.name || 'Unknown Pet'}</p>
                          <Badge variant="default">{prescription.medication_name}</Badge>
                        </div>
                        <p className="text-sm mb-1">Dosage: {prescription.dosage}</p>
                        <p className="text-sm mb-1">Instructions: {prescription.instructions}</p>
                        <p className="text-xs text-muted-foreground">
                          Prescribed: {new Date(prescription.prescribed_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Prescribed by: {prescription.veterinarian_name || 'Unknown'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VetPortal;
