export interface ImageValidationResult {
  valid: boolean
  error?: string
}

export interface ImageValidationOptions {
  maxSizeInMB?: number
  allowedTypes?: string[]
  maxWidth?: number
  maxHeight?: number
  minWidth?: number
  minHeight?: number
}

const DEFAULT_OPTIONS: Required<ImageValidationOptions> = {
  maxSizeInMB: 5,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxWidth: 4096,
  maxHeight: 4096,
  minWidth: 100,
  minHeight: 100,
}

export async function validateImage(
  file: File,
  options: ImageValidationOptions = {}
): Promise<ImageValidationResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'File must be an image',
    }
  }

  if (!opts.allowedTypes.includes(file.type)) {
    const allowedExtensions = opts.allowedTypes.map((type) => type.split('/')[1]).join(', ')
    return {
      valid: false,
      error: `Only ${allowedExtensions} files are allowed`,
    }
  }

  const maxSizeInBytes = opts.maxSizeInMB * 1024 * 1024
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `File size must be less than ${opts.maxSizeInMB}MB`,
    }
  }

  try {
    const dimensions = await getImageDimensions(file)

    if (dimensions.width > opts.maxWidth || dimensions.height > opts.maxHeight) {
      return {
        valid: false,
        error: `Image dimensions must be less than ${opts.maxWidth}x${opts.maxHeight}px`,
      }
    }

    if (dimensions.width < opts.minWidth || dimensions.height < opts.minHeight) {
      return {
        valid: false,
        error: `Image dimensions must be at least ${opts.minWidth}x${opts.minHeight}px`,
      }
    }

    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: 'Failed to read image file',
    }
  }
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.width,
        height: img.height,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
