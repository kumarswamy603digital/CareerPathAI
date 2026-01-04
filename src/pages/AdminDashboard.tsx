import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Users, 
  TrendingUp, 
  Star, 
  BarChart3, 
  ArrowLeft, 
  RefreshCw,
  UserCheck,
  Globe,
  Briefcase
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, isLoading: roleLoading } = useAdminRole();
  const { 
    careerAnalytics, 
    assessmentAnalytics, 
    shortlistAnalytics, 
    userStats, 
    isLoading, 
    error,
    refetch 
  } = useAdminAnalytics();

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, roleLoading, navigate]);

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-serif font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">User analytics & popular careers</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
            Error loading analytics: {error}
          </div>
        )}

        {/* User Stats Cards */}
        <section>
          <h2 className="text-lg font-serif font-semibold mb-4">User Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{userStats?.total_users || 0}</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed Onboarding</CardTitle>
                <UserCheck className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{userStats?.users_with_onboarding || 0}</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Public Profiles</CardTitle>
                <Globe className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{userStats?.public_profiles || 0}</div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Career Views Chart */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <CardTitle>Most Viewed Careers</CardTitle>
              </div>
              <CardDescription>Career pages with the most views</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : careerAnalytics.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No career view data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={careerAnalytics.slice(0, 10)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs fill-muted-foreground" />
                    <YAxis 
                      type="category" 
                      dataKey="career_name" 
                      width={150} 
                      className="text-xs fill-muted-foreground"
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number, name: string) => [
                        value, 
                        name === 'view_count' ? 'Views' : 'Unique Users'
                      ]}
                    />
                    <Bar dataKey="view_count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <CardTitle>AI Recommended Careers</CardTitle>
              </div>
              <CardDescription>Most recommended by the AI advisor</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : assessmentAnalytics.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No assessment data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={assessmentAnalytics.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="recommendation_count"
                      nameKey="recommended_career"
                      label={({ recommended_career, percent }) => 
                        `${recommended_career.slice(0, 12)}${recommended_career.length > 12 ? '...' : ''} (${(percent * 100).toFixed(0)}%)`
                      }
                      labelLine={false}
                    >
                      {assessmentAnalytics.slice(0, 5).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* User Shortlists */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                <CardTitle>Most Shortlisted Careers</CardTitle>
              </div>
              <CardDescription>Careers users save to their shortlist</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : shortlistAnalytics.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No shortlist data yet
                </div>
              ) : (
                <div className="space-y-3">
                  {shortlistAnalytics.slice(0, 8).map((item, index) => (
                    <div 
                      key={item.career_name} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span className="font-medium">{item.career_name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.shortlist_count} saves
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Career Views Table */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Detailed Career Analytics</CardTitle>
              <CardDescription>Full breakdown of career page views</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : careerAnalytics.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No career view data yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Career</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Views</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Unique Users</th>
                      </tr>
                    </thead>
                    <tbody>
                      {careerAnalytics.map((item) => (
                        <tr key={item.career_name} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{item.career_name}</td>
                          <td className="py-3 px-4 text-right">{item.view_count}</td>
                          <td className="py-3 px-4 text-right">{item.unique_users}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
