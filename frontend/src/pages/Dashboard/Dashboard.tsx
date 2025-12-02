import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    People as PeopleIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { studentService } from '../../services/studentService';
import { moduleService } from '../../services/moduleService';
import { examService } from '../../services/examService';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        students: 0,
        modules: 0,
        exams: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const [students, modules, exams] = await Promise.all([
                    studentService.getAllStudents(),
                    moduleService.getAllModules(),
                    examService.getAllExams(),
                ]);
                setStats({
                    students: students.length,
                    modules: modules.length,
                    exams: exams.length,
                });
                setError(null);
            } catch (err) {
                setError('Errore nel caricamento delle statistiche. Assicurati che il backend sia attivo.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const cards = [
        {
            title: 'Studenti',
            count: stats.students,
            icon: <PeopleIcon sx={{ fontSize: 48 }} />,
            color: '#1976d2',
            path: '/students',
        },
        {
            title: 'Moduli',
            count: stats.modules,
            icon: <SchoolIcon sx={{ fontSize: 48 }} />,
            color: '#388e3c',
            path: '/modules',
        },
        {
            title: 'Esami',
            count: stats.exams,
            icon: <AssignmentIcon sx={{ fontSize: 48 }} />,
            color: '#f57c00',
            path: '/exams',
        },
    ];

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                    Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Benvenuto nel gestionale ITS. Qui trovi una panoramica rapida del sistema.
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, boxShadow: 1 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={4}>
                {cards.map((card) => (
                    <Grid item xs={12} sm={6} md={4} key={card.title}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: 3,
                                borderRadius: 2,
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: 8,
                                },
                            }}
                            onClick={() => navigate(card.path)}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                                            {card.title}
                                        </Typography>
                                        <Typography variant="h3" sx={{ fontWeight: 700, color: card.color }}>
                                            {card.count}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ color: card.color, opacity: 0.8 }}>
                                        {card.icon}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Dashboard;
