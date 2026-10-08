import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Code, 
  File 
} from 'lucide-react';

export function getFileIcon(fileName = '') {
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();

  switch (ext) {
    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.gif':
    case '.svg':
    case '.webp':
      return { icon: Image, color: 'text-emerald-400', bg: 'bg-emerald-500/10' };

    case '.mp4':
    case '.mkv':
    case '.avi':
    case '.mov':
    case '.webm':
      return { icon: Video, color: 'text-purple-400', bg: 'bg-purple-500/10' };

    case '.mp3':
    case '.wav':
    case '.ogg':
    case '.m4a':
      return { icon: Music, color: 'text-amber-400', bg: 'bg-amber-500/10' };

    case '.zip':
    case '.rar':
    case '.tar':
    case '.gz':
    case '.7z':
      return { icon: Archive, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };

    case '.pdf':
    case '.doc':
    case '.docx':
    case '.txt':
      return { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' };

    case '.js':
    case '.jsx':
    case '.ts':
    case '.tsx':
    case '.html':
    case '.css':
    case '.json':
      return { icon: Code, color: 'text-rose-400', bg: 'bg-rose-500/10' };

    default:
      return { icon: File, color: 'text-indigo-400', bg: 'bg-indigo-500/10' };
  }
}