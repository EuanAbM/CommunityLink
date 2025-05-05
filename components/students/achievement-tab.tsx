"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Trophy, Medal, Award, Star } from "lucide-react"

interface Achievement {
  id: string
  student_id: string
  title: string
  description: string
  date: string
  awarded_by: string
  achievement_type?: string
}

interface ExtracurricularActivity {
  id: string
  student_id: string
  activity_name: string
  role: string
  description: string
  start_date: string
  end_date: string | null
}

interface AchievementTabProps {
  studentId: string
}

// Function to get achievement icon based on title or type
function getAchievementIcon(achievement: Achievement) {
  const title = achievement.title.toLowerCase();
  const type = achievement.achievement_type?.toLowerCase() || '';
  
  if (title.includes('trophy') || title.includes('winner') || type.includes('trophy')) {
    return <Trophy className="h-5 w-5 text-yellow-500" />;
  } else if (title.includes('medal') || type.includes('medal')) {
    return <Medal className="h-5 w-5 text-blue-500" />;
  } else if (title.includes('award') || type.includes('award')) {
    return <Award className="h-5 w-5 text-purple-500" />;
  } else {
    return <Star className="h-5 w-5 text-amber-500" />;
  }
}

export function AchievementTab({ studentId }: AchievementTabProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [extracurricular, setExtracurricular] = useState<ExtracurricularActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAchievementData() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch achievements
        const achievementsResponse = await fetch(`/api/students/${studentId}/achievements`);
        if (!achievementsResponse.ok) {
          throw new Error('Failed to fetch achievements');
        }
        const achievementsData = await achievementsResponse.json();
        
        // Fetch extracurricular activities
        const extracurricularResponse = await fetch(`/api/students/${studentId}/extracurricular`);
        if (!extracurricularResponse.ok) {
          throw new Error('Failed to fetch extracurricular activities');
        }
        const extracurricularData = await extracurricularResponse.json();
        
        setAchievements(achievementsData);
        setExtracurricular(extracurricularData);
      } catch (err) {
        console.error('Error fetching achievement data:', err);
        setError('Could not load achievement data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAchievementData();
  }, [studentId]);

  // Group achievements by academic year
  const groupedAchievements = achievements.reduce((groups: { [key: string]: Achievement[] }, item) => {
    // Extract academic year from date (assuming format YYYY-MM-DD)
    const date = new Date(item.date);
    let academicYear;
    
    // Academic year runs from September to August
    if (date.getMonth() >= 8) { // September onwards
      academicYear = `${date.getFullYear()}/${date.getFullYear() + 1}`;
    } else {
      academicYear = `${date.getFullYear() - 1}/${date.getFullYear()}`;
    }
    
    if (!groups[academicYear]) {
      groups[academicYear] = [];
    }
    groups[academicYear].push(item);
    return groups;
  }, {});

  // Sort achievements within each academic year by date (newest first)
  Object.keys(groupedAchievements).forEach(year => {
    groupedAchievements[year].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  // Sort academic years (most recent first)
  const sortedYears = Object.keys(groupedAchievements).sort().reverse();

  if (isLoading) return <div>Loading achievement data...</div>;
  
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>
            Student's achievements and recognition
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedYears.length > 0 ? (
            <div className="space-y-6">
              {sortedYears.map(year => (
                <div key={year} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Academic Year {year}</h3>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">
                      {groupedAchievements[year].length} Achievement{groupedAchievements[year].length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {groupedAchievements[year].map(achievement => (
                      <div key={achievement.id} className="flex items-start gap-3 border-b pb-4 last:border-0">
                        <div className="rounded-full bg-primary/10 p-2 mt-1">
                          {getAchievementIcon(achievement)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <span className="text-sm text-muted-foreground">{formatDate(achievement.date)}</span>
                          </div>
                          
                          <p className="text-sm mt-1">{achievement.description}</p>
                          
                          {achievement.awarded_by && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Awarded by: {achievement.awarded_by}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p>No achievements recorded for this student</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Extracurricular Activities</CardTitle>
          <CardDescription>
            Student's participation in clubs, teams and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {extracurricular.length > 0 ? (
            <div className="space-y-4">
              {extracurricular.map(activity => {
                const isOngoing = !activity.end_date;
                const duration = isOngoing
                  ? `Since ${formatDate(activity.start_date)}`
                  : `${formatDate(activity.start_date)} - ${formatDate(activity.end_date || '')}`;
                
                return (
                  <div key={activity.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium">{activity.activity_name}</h3>
                      {isOngoing && <Badge>Current</Badge>}
                    </div>
                    
                    <div className="grid gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="font-medium">{activity.role}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p>{duration}</p>
                      </div>
                      
                      {activity.description && (
                        <div>
                          <p className="text-sm text-muted-foreground">Description</p>
                          <p>{activity.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p>No extracurricular activities recorded for this student</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

