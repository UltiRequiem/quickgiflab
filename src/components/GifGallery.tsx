'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ExternalLink, Trash2, RefreshCw } from 'lucide-react';

interface GifRecord {
  id: number;
  filename: string;
  tixte_url: string;
  created_at: string;
  size: number;
  duration?: number;
}

export default function GifGallery() {
  const [gifs, setGifs] = useState<GifRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGifs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gifs');
      const data = await response.json();

      if (response.ok) {
        setGifs(data.gifs);
      } else {
        throw new Error(data.error || 'Failed to fetch GIFs');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load GIFs from database.",
        variant: "destructive"
      });
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteGif = async (id: number) => {
    try {
      const response = await fetch(`/api/gifs/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setGifs(prev => prev.filter(gif => gif.id !== id));
        toast({
          title: "Success",
          description: "GIF deleted successfully."
        });
      } else {
        throw new Error(data.error || 'Failed to delete GIF');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete GIF.",
        variant: "destructive"
      });
      console.error('Delete error:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    fetchGifs();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              📸 Your GIF Gallery
            </CardTitle>
            <CardDescription>
              View and manage your uploaded GIFs
            </CardDescription>
          </div>
          <Button
            onClick={fetchGifs}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading your GIFs...
          </div>
        ) : gifs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No GIFs uploaded yet.</p>
            <p className="text-sm mt-2">Start by recording your first screen capture above!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {gifs.map((gif) => (
              <Card key={gif.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <img
                    src={gif.tixte_url}
                    alt={gif.filename}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                  />
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm truncate" title={gif.filename}>
                      {gif.filename}
                    </h3>

                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {formatFileSize(gif.size)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {formatDate(gif.created_at)}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 flex items-center gap-1"
                        onClick={() => window.open(gif.tixte_url, '_blank')}
                      >
                        <ExternalLink size={12} />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteGif(gif.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}