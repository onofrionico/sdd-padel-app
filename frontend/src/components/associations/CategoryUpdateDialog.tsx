import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateMemberCategory } from '@/hooks/useAssociations'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Edit } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface CategoryUpdateDialogProps {
  associationId: string
  currentCategory?: number
  onSuccess?: () => void
}

export function CategoryUpdateDialog({ 
  associationId, 
  currentCategory,
  onSuccess 
}: CategoryUpdateDialogProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>(
    currentCategory?.toString() || '1'
  )
  const updateCategory = useUpdateMemberCategory()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      await updateCategory.mutateAsync({
        associationId,
        userId: user.id.toString(),
        data: { category: parseInt(selectedCategory) },
      })
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          {t('association.category.update')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('association.category.update')}</DialogTitle>
            <DialogDescription>
              {t('association.category.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">{t('rankings.page.category')}</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder={t('association.category.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((cat) => (
                    <SelectItem key={cat} value={cat.toString()}>
                      {cat}st Category
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updateCategory.isPending}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={updateCategory.isPending}>
              {updateCategory.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('association.category.updating')}
                </>
              ) : (
                t('association.category.update')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
