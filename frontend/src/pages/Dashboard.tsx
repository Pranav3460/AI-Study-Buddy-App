import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { studyPlan } from '../services/api';

interface Topic {
  id: number;
  name: string;
  estimatedHours: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState({ name: '', estimatedHours: '' });
  const [studyPreferences, setStudyPreferences] = useState({
    daysUntilExam: '',
    dailyStudyHours: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTopic = () => {
    if (newTopic.name && newTopic.estimatedHours) {
      setTopics([
        ...topics,
        {
          id: Date.now(),
          name: newTopic.name,
          estimatedHours: Number(newTopic.estimatedHours),
        },
      ]);
      setNewTopic({ name: '', estimatedHours: '' });
    }
  };

  const handleDeleteTopic = (id: number) => {
    setTopics(topics.filter((topic) => topic.id !== id));
  };

  const handleGeneratePlan = async () => {
    if (!studyPreferences.daysUntilExam || !studyPreferences.dailyStudyHours) {
      setError('Please fill in all study preferences');
      return;
    }

    if (topics.length === 0) {
      setError('Please add at least one topic');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await studyPlan.create({
        topics: topics.map(({ name, estimatedHours }) => ({
          name,
          estimatedHours,
        })),
        daysUntilExam: Number(studyPreferences.daysUntilExam),
        dailyStudyHours: Number(studyPreferences.dailyStudyHours),
      });

      navigate('/study-plan', { state: { studyPlan: response } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating study plan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Your Study Plan
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Study Preferences
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Days until exam"
                type="number"
                value={studyPreferences.daysUntilExam}
                onChange={(e) =>
                  setStudyPreferences({
                    ...studyPreferences,
                    daysUntilExam: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Daily study hours"
                type="number"
                value={studyPreferences.dailyStudyHours}
                onChange={(e) =>
                  setStudyPreferences({
                    ...studyPreferences,
                    dailyStudyHours: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add Topics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Topic Name"
                value={newTopic.name}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Estimated Hours"
                type="number"
                value={newTopic.estimatedHours}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, estimatedHours: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddTopic}
                sx={{ height: '100%' }}
              >
                Add
              </Button>
            </Grid>
          </Grid>

          <List sx={{ mt: 2 }}>
            {topics.map((topic) => (
              <ListItem
                key={topic.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteTopic(topic.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={topic.name}
                  secondary={`Estimated hours: ${topic.estimatedHours}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={handleGeneratePlan}
          disabled={isLoading || topics.length === 0}
        >
          {isLoading ? 'Generating Plan...' : 'Generate Study Plan'}
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard; 