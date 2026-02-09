import { useState, useCallback, useRef } from 'react';

export interface FileWithPreview extends File {
  preview?: string;
}

export interface DropzoneOptions {
  /** Accepted file types */
  accept?: Record<string, string[]>;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Whether to allow multiple files */
  multiple?: boolean;
  /** Callback when files are dropped */
  onDrop?: (files: File[]) => void;
  /** Callback when a file is rejected */
  onDropRejected?: (file: File, reason: string) => void;
}

export interface DropzoneResult {
  /** Whether the dropzone is active */
  isDragActive: boolean;
  /** Input reference */
  inputRef: React.RefObject<HTMLInputElement>;
  /** Open file picker */
  open: () => void;
  /** Get root props for the dropzone */
  getRootProps: () => {
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
  /** Get input props for the hidden input */
  getInputProps: () => {
    ref: React.RefObject<HTMLInputElement>;
    accept: string | undefined;
    multiple: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

/**
 * Hook for handling file drag and drop
 */
export function useDropzone(
  options: DropzoneOptions = {}
): DropzoneResult {
  const {
    accept,
    maxSize,
    maxFiles,
    multiple = true,
    onDrop,
    onDropRejected,
  } = options;

  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback(
    (files: File[]): { valid: File[]; rejected: { file: File; reason: string }[] } => {
      const valid: File[] = [];
      const rejected: { file: File; reason: string }[] = [];

      if (maxFiles && files.length > maxFiles) {
        files.forEach((file) => {
          rejected.push({ file, reason: `Maximum ${maxFiles} files allowed` });
        });
        return { valid: [], rejected };
      }

      files.forEach((file) => {
        // Check file type
        if (accept && Object.keys(accept).length > 0) {
          const fileType = file.type;
          const acceptedTypes = Object.values(accept).flat();
          const isAccepted = acceptedTypes.some((type) => {
            if (type.endsWith('/*')) {
              return fileType.startsWith(type.replace('/*', ''));
            }
            return fileType === type;
          });
          
          if (!isAccepted) {
            rejected.push({ file, reason: 'File type not accepted' });
            return;
          }
        }

        // Check file size
        if (maxSize && file.size > maxSize) {
          rejected.push({ file, reason: `File too large (max ${maxSize / 1024}KB)` });
          return;
        }

        valid.push(file);
      });

      return { valid, rejected };
    },
    [accept, maxSize, maxFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setIsDragActive(false);

      let files: File[] = [];

      if ('dataTransfer' in e) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        files = multiple ? droppedFiles : [droppedFiles[0]].filter(Boolean);
      } else {
        const selectedFiles = Array.from(e.target.files || []);
        files = multiple ? selectedFiles : [selectedFiles[0]].filter(Boolean);
      }

      if (files.length === 0) return;

      const { valid, rejected } = validateFiles(files);

      if (rejected.length > 0) {
        rejected.forEach(({ file, reason }) => {
          onDropRejected?.(file, reason);
        });
      }

      if (valid.length > 0) {
        onDrop?.(valid);
      }
    },
    [multiple, validateFiles, onDrop, onDropRejected]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const open = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const getRootProps = useCallback(
    () => ({
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    }),
    [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]
  );

  const getInputProps = useCallback(
    () => ({
      ref: inputRef,
      accept: accept ? Object.keys(accept).join(',') : undefined,
      multiple,
      onChange: handleDrop,
    }),
    [accept, multiple, handleDrop]
  );

  return {
    isDragActive,
    inputRef,
    open,
    getRootProps,
    getInputProps,
  };
}

export default useDropzone;
