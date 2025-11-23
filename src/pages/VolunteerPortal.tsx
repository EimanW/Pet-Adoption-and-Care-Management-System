/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle, Clock, Heart, Users, Activity } from "lucide-react";
import petIcon from "@/assets/pet-icon.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface VolunteerData {
  id: string;
  user_id: string;
  availability: string[] | null;
  skills: string[] | null;
  experience: string | null;
  status: string;
  application_date: string;
  approved_at: string | null;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  volunteers_needed: number;
  volunteers_assigned: number;
  status: string;
  created_at: string;
}

interface Assignment {
  id: string;
  volunteer_id: string;
  activity_id: string;
  status: string;
  assigned_at: string;
  completed_at: string | null;
  volunteer_activities: Activity | null;
}

const VolunteerPortal = () => {
  const { toast } = useToast();
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [volunteerData, setVolunteerData] = useState<VolunteerData | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (userRole !== 'volunteer') {
      toast({
        title: "Access Denied",
        description: "You don't have volunteer privileges.",
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
      fetchVolunteerData(),
      fetchAssignments(),
      fetchAvailableActivities()
    ]);
    setLoading(false);
  };

  const fetchVolunteerData = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();
      
      if (error) throw error;
      setVolunteerData(data);
    } catch (error) {
      console.error('Error fetching volunteer data:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteer_assignments')
        .select(`
          *,
          volunteer_activities (*)
        `)
        .eq('volunteer_id', user!.id)
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      setAssignments(data as unknown as Assignment[] || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchAvailableActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteer_activities')
        .select('*')
        .eq('status', 'open')
        .order('date', { ascending: true });
      
      if (error) throw error;
      setAvailableActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleSignUpForActivity = async (activityId: string) => {
    try {
      const { error } = await supabase
        .from('volunteer_assignments')
        .insert({
          volunteer_id: user!.id,
          activity_id: activityId,
          status: 'assigned'
        });

      if (error) throw error;

      toast({ title: "Success", description: "You've been signed up for this activity!" });
      fetchAssignments();
      fetchAvailableActivities();
    } catch (error) {
      console.error('Error signing up for activity:', error);
      toast({ title: "Error", description: "Failed to sign up for activity", variant: "destructive" });
    }
  };

  const handleCompleteActivity = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('volunteer_assignments')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({ title: "Success", description: "Activity marked as completed!" });
      fetchAssignments();
    } catch (error) {
      console.error('Error completing activity:', error);
      toast({ title: "Error", description: "Failed to complete activity", variant: "destructive" });
    }
  };

  const upcomingAssignments = assignments.filter(a => a.status === 'assigned');
  const completedAssignments = assignments.filter(a => a.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      {/* Volunteer Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={petIcon} alt="PawHaven" className="h-10 w-10" />
            <div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                PawHaven Volunteer Portal
              </span>
              <p className="text-xs text-muted-foreground">Volunteer Dashboard</p>
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
        {/* Volunteer Status Card */}
        {volunteerData && (
          <Card className="shadow-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Your Volunteer Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={volunteerData.status === 'approved' ? 'default' : 'secondary'} className="capitalize mt-1">
                    {volunteerData.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application Date</p>
                  <p className="font-medium">{new Date(volunteerData.application_date).toLocaleDateString()}</p>
                </div>
                {volunteerData.approved_at && (
                  <div>
                    <p className="text-sm text-muted-foreground">Approved Date</p>
                    <p className="font-medium">{new Date(volunteerData.approved_at).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              {volunteerData.availability && volunteerData.availability.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Your Availability</p>
                  <div className="flex flex-wrap gap-2">
                    {volunteerData.availability.map((item, index) => (
                      <Badge key={index} variant="outline">{item}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {volunteerData.skills && volunteerData.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Your Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {volunteerData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Upcoming Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAssignments.length}</div>
              <p className="text-xs text-muted-foreground">Assigned to you</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                Completed Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAssignments.length}</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-secondary" />
                Available Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableActivities.length}</div>
              <p className="text-xs text-muted-foreground">Ready to join</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="my-activities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-activities">My Activities</TabsTrigger>
            <TabsTrigger value="available">Available Activities</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* My Activities Tab */}
          <TabsContent value="my-activities" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Your Assigned Activities
                </CardTitle>
                <CardDescription>Activities you're scheduled to participate in</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading activities...</p>
                ) : upcomingAssignments.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No assigned activities yet</p>
                    <p className="text-sm text-muted-foreground">Check the Available Activities tab to sign up!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAssignments.map((assignment) => {
                      const activity = assignment.volunteer_activities;
                      if (!activity) return null;
                      
                      return (
                        <div key={assignment.id} className="p-4 rounded-lg border border-border">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{activity.title}</p>
                                <Badge variant="default">{activity.status}</Badge>
                              </div>
                              <p className="text-sm">{activity.description}</p>
                              <div className="flex gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(activity.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {activity.time}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Location: {activity.location}
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleCompleteActivity(assignment.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Mark Complete
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Available Activities Tab */}
          <TabsContent value="available" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Available Activities
                </CardTitle>
                <CardDescription>Sign up for activities that need volunteers</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading activities...</p>
                ) : availableActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No available activities at the moment</p>
                    <p className="text-sm text-muted-foreground">Check back later for new opportunities!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableActivities.map((activity) => (
                      <div key={activity.id} className="p-4 rounded-lg border border-border">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{activity.title}</p>
                              <Badge variant="secondary">
                                {activity.volunteers_assigned}/{activity.volunteers_needed} volunteers
                              </Badge>
                            </div>
                            <p className="text-sm">{activity.description}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(activity.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Location: {activity.location}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleSignUpForActivity(activity.id)}
                            disabled={activity.volunteers_assigned >= activity.volunteers_needed}
                          >
                            {activity.volunteers_assigned >= activity.volunteers_needed ? 'Full' : 'Sign Up'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Completed Activities
                </CardTitle>
                <CardDescription>Your volunteer history</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading completed activities...</p>
                ) : completedAssignments.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No completed activities yet</p>
                    <p className="text-sm text-muted-foreground">Complete activities to build your volunteer history!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedAssignments.map((assignment) => {
                      const activity = assignment.volunteer_activities;
                      if (!activity) return null;
                      
                      return (
                        <div key={assignment.id} className="p-4 rounded-lg border border-border bg-muted/50">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{activity.title}</p>
                              <Badge variant="outline">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            </div>
                            <p className="text-sm">{activity.description}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span>Completed: {assignment.completed_at ? new Date(assignment.completed_at).toLocaleDateString() : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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

export default VolunteerPortal;
