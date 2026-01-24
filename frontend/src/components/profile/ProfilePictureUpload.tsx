import { useState, useRef, useCallback } from 'react'
import { Upload, X, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { validateImage } from '@/lib/imageValidation'
import { cn } from '@/lib/utils'

interface ProfilePictureUploadProps {
  currentPictureUrl?: string
  onUpload: (file: File) => Promise<unknown>
  isUploading?: boolean
  className?: string
}

export function ProfilePictureUpload({
  currentPictureUrl,
  onUpload,
  isUploading = false,
  className,
}: ProfilePictureUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)

      const validation = await validateImage(file, {
        maxSizeInMB: 5,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        maxWidth: 2048,
        maxHeight: 2048,
        minWidth: 100,
        minHeight: 100,
      })

      if (!validation.valid) {
        setError(validation.error || 'Invalid image')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      try {
        await onUpload(file)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload image')
        setPreview(null)
      }
    },
    [onUpload]
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0])
      }
    },
    [handleFile]
  )

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemovePreview = () => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const displayImage = preview || currentPictureUrl

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className={cn(
                  'w-32 h-32 rounded-full overflow-hidden border-4 border-border bg-muted flex items-center justify-center',
                  isUploading && 'opacity-50'
                )}
              >
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
            </div>

            <div className="text-center">
              <h3 className="font-semibold">Profile Picture</h3>
              <p className="text-sm text-muted-foreground">
                JPG, PNG or WEBP. Max 5MB. Min 100x100px.
              </p>
            </div>
          </div>

          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
              dragActive ? 'border-primary bg-primary/5' : 'border-border',
              isUploading && 'pointer-events-none opacity-50'
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleChange}
              disabled={isUploading}
            />

            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">
              Drag and drop your image here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Recommended: Square image, at least 400x400px
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {preview && !isUploading && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">New image ready</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePreview}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
