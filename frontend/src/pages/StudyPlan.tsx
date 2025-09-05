import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Link,
  Divider,
} from '@mui/material';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
}

interface StudySession {
  topic: string;
  duration: number;
  date: string;
  videos: Video[];
}

const StudyPlan = () => {
  const [studyPlan, setStudyPlan] = useState<StudySession[]>([]);

  useEffect(() => {
    // TODO: Fetch study plan from backend
    // This is mock data for demonstration
    setStudyPlan([
      {
        topic: 'Introduction to React',
        duration: 2,
        date: '2024-03-20',
        videos: [
          {
            id: '1',
            title: 'React Crash Course',
            thumbnail: 'https://i.ytimg.com/vi/bMknfKXIFA8/maxresdefault.jpg',
            url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
          },
        ],
      },
      {
        topic: 'React Hooks',
        duration: 3,
        date: '2024-03-21',
        videos: [
          {
            id: '2',
            title: 'React Hooks Explained',
            thumbnail: 'https://i.ytimg.com/vi/dpw9EHDh2bM/maxresdefault.jpg',
            url: 'https://www.youtube.com/watch?v=dpw9EHDh2bM',
          },
        ],
      },
    ]);
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Personalized Study Plan
        </Typography>

        {studyPlan.map((session, index) => (
          <Paper key={index} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {session.topic}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Duration: {session.duration} hours | Date: {session.date}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Recommended Videos:
            </Typography>
            
            <Grid container spacing={2}>
              {session.videos.map((video) => (
                <Grid item xs={12} sm={6} key={video.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={video.thumbnail}
                      alt={video.title}
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {video.title}
                      </Typography>
                      <Link
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Watch Video
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default StudyPlan; 