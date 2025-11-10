import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PawPrint, FileText, CheckCircle, XCircle, Calendar, ClipboardList } from "lucide-react";
import petIcon from "@/assets/pet-icon.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: string;
  status: string;
  submitted_at: string;
  pets: { 
    id: string;
    name: string; 
    image_url: string;
    species: string;
    breed: string;
    age: number;
    health_status: string;
  } | null;
  profiles: { first_name: string; last_name: string; email: string; phone: string } | null;
  reason?: string;
  home_type?: string;
  has_yard?: boolean;
  has_other_pets?: boolean;
  has_children?: boolean;
  experience?: string;
}

interface MedicalRecord {
  id: string;
  pet_id: string;
  record_type: string;
  description: string;
  date: string;
  veterinarian: string;
  notes: string;
  pets: { name: string } | null;
}

const Vet = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch adoption applications
  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('adoption_applications')
        .select(`
          *,
          pets (id, name, image_url, species, breed, age, health_status),
          profiles (first_name, last_name, email, phone)
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications((data as unknown as Application[]) || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load adoption applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          *,
          pets (name)
        `)
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setMedicalRecords((data as unknown as MedicalRecord[]) || []);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchMedicalRecords();
  }, []);

  const handleApplicationAction = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('adoption_applications')
        .update({ 
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${newStatus} successfully`,
      });
      
      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive"
      });
    }
  };

  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const underReviewCount = applications.filter(a => a.status === 'under_review').length;

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
              <p className="text-xs text-muted-foreground">Veterinary Services</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">View Site</Link>
            </Button>
            <Button variant="ghost" size="sm">
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
                <FileText className="h-4 w-4 text-primary" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Applications awaiting</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-accent" />
                Under Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{underReviewCount}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-secondary" />
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-health" />
                Medical Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{medicalRecords.length}</div>
              <p className="text-xs text-muted-foreground">Recent entries</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Adoption Applications</TabsTrigger>
            <TabsTrigger value="medical">Medical Records</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Review Adoption Applications</CardTitle>
                    <CardDescription>Evaluate and approve adoption requests based on pet health and compatibility</CardDescription>
                  </div>
                  <Badge variant="outline">
                    {pendingCount} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading applications...</p>
                ) : applications.length === 0 ? (
                  <p className="text-muted-foreground">No applications found</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="p-4 rounded-lg border border-border space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-lg">
                                {app.profiles?.first_name} {app.profiles?.last_name}
                              </p>
                              <Badge 
                                variant={
                                  app.status === 'approved' ? 'default' :
                                  app.status === 'rejected' ? 'destructive' :
                                  app.status === 'under_review' ? 'secondary' :
                                  'outline'
                                } 
                                className="capitalize"
                              >
                                {app.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-muted-foreground">Contact:</p>
                                <p className="font-medium">{app.profiles?.email}</p>
                                {app.profiles?.phone && <p className="text-xs">{app.profiles.phone}</p>}
                              </div>
                              
                              <div>
                                <p className="text-muted-foreground">Pet Details:</p>
                                <p className="font-medium">{app.pets?.name || 'Unknown'}</p>
                                <p className="text-xs">
                                  {app.pets?.species} • {app.pets?.breed} • {app.pets?.age} years old
                                </p>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Home Type: <span className="font-medium">{app.home_type || 'Not specified'}</span></p>
                              <p className="text-sm text-muted-foreground">
                                Has Yard: <span className="font-medium">{app.has_yard ? 'Yes' : 'No'}</span> • 
                                Has Other Pets: <span className="font-medium">{app.has_other_pets ? 'Yes' : 'No'}</span> • 
                                Has Children: <span className="font-medium">{app.has_children ? 'Yes' : 'No'}</span>
                              </p>
                            </div>

                            {app.reason && (
                              <div>
                                <p className="text-sm text-muted-foreground">Reason for Adoption:</p>
                                <p className="text-sm mt-1">{app.reason}</p>
                              </div>
                            )}

                            {app.experience && (
                              <div>
                                <p className="text-sm text-muted-foreground">Experience:</p>
                                <p className="text-sm mt-1">{app.experience}</p>
                              </div>
                            )}

                            {app.pets?.health_status && (
                              <div className="bg-muted/50 p-2 rounded">
                                <p className="text-sm text-muted-foreground">Pet Health Status:</p>
                                <p className="text-sm font-medium">{app.pets.health_status}</p>
                              </div>
                            )}

                            <p className="text-xs text-muted-foreground">
                              Submitted: {new Date(app.submitted_at).toLocaleDateString()} at {new Date(app.submitted_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                          {app.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-1"
                                onClick={() => handleApplicationAction(app.id, 'under_review')}
                              >
                                <ClipboardList className="h-3 w-3" />
                                Under Review
                              </Button>
                              <Button 
                                size="sm" 
                                variant="default" 
                                className="gap-1"
                                onClick={() => handleApplicationAction(app.id, 'approved')}
                              >
                                <CheckCircle className="h-3 w-3" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="gap-1"
                                onClick={() => handleApplicationAction(app.id, 'rejected')}
                              >
                                <XCircle className="h-3 w-3" />
                                Reject
                              </Button>
                            </>
                          )}
                          {app.status === 'under_review' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="default" 
                                className="gap-1"
                                onClick={() => handleApplicationAction(app.id, 'approved')}
                              >
                                <CheckCircle className="h-3 w-3" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="gap-1"
                                onClick={() => handleApplicationAction(app.id, 'rejected')}
                              >
                                <XCircle className="h-3 w-3" />
                                Reject
                              </Button>
                            </>
                          )}
                          {(app.status === 'approved' || app.status === 'rejected') && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="gap-1"
                              onClick={() => handleApplicationAction(app.id, 'pending')}
                            >
                              Reset to Pending
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Medical Records</CardTitle>
                <CardDescription>View and manage pet medical history</CardDescription>
              </CardHeader>
              <CardContent>
                {medicalRecords.length === 0 ? (
                  <p className="text-muted-foreground">No medical records found</p>
                ) : (
                  <div className="space-y-3">
                    {medicalRecords.map((record) => (
                      <div key={record.id} className="p-3 rounded-lg border border-border">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold">{record.pets?.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {record.record_type} • {new Date(record.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm">{record.description}</p>
                            {record.notes && (
                              <p className="text-xs text-muted-foreground mt-1">Notes: {record.notes}</p>
                            )}
                          </div>
                          <Badge variant="outline">{record.veterinarian}</Badge>
                        </div>
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

export default Vet;
