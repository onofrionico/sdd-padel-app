import { EnrollmentWithDetails } from '@/types/enrollment'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Trophy } from 'lucide-react'

interface ParticipantsListProps {
  enrollments: EnrollmentWithDetails[]
}

export function ParticipantsList({ enrollments }: ParticipantsListProps) {
  const approvedEnrollments = enrollments.filter((e) => e.status === 'approved')
  
  const categoryCounts = approvedEnrollments.reduce((acc, enrollment) => {
    acc[enrollment.category] = (acc[enrollment.category] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  if (approvedEnrollments.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No approved participants yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{approvedEnrollments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{approvedEnrollments.length * 2}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Object.keys(categoryCounts).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* By Category */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Teams by Category</h3>
        <div className="space-y-4">
          {Object.entries(categoryCounts)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([category, count]) => {
              const categoryEnrollments = approvedEnrollments.filter(
                (e) => e.category === Number(category)
              )
              return (
                <Card key={category}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        <CardTitle>Category {category}</CardTitle>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {count} {count === 1 ? 'team' : 'teams'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categoryEnrollments.map((enrollment, index) => (
                        <div
                          key={enrollment.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-muted-foreground">
                              #{index + 1}
                            </span>
                            <div>
                              <p className="font-medium">
                                {enrollment.player1.firstName} {enrollment.player1.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {enrollment.player2.firstName} {enrollment.player2.lastName}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      </div>
    </div>
  )
}
