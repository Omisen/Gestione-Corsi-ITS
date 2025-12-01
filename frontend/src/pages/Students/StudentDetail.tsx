import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Stack,
    Avatar,
    Divider,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Email as EmailIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { studentService } from '../../services/studentService';
import type { Student, StudentStats } from '../../types/types';
import StudentModules from '../../components/Students/StudentModules';
import StudentExams from '../../components/Students/StudentExams';

const StudentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [student, setStudent] = useState<Student | null>(null);
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const studentData = await studentService.getStudentById(id);
                setStudent(studentData);

                // Try to fetch stats, but don't block if it fails (e.g. no exams)
                try {
                    const statsData = await studentService.getStudentStats(id);
                    setStats(statsData);
                } catch (e) {
                    console.log('No stats available or error fetching stats');
                }
            } catch (err) {
                console.error(err);
                setError('Errore nel caricamento dei dati dello studente.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !student) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error || 'Studente non trovato'}
            </Alert>
        );
    }

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/students')}
                sx={{ mb: 3 }}
                color="inherit"
            >
                Torna alla lista
            </Button>

            <Grid container spacing={3}>
                {/* Header / Profile Card */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                        <Avatar
                            sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}
                        >
                            {student.nome[0]}{student.cognome[0]}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                                {student.nome} {student.cognome}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1, color: 'text.secondary' }}>
                                <EmailIcon fontSize="small" />
                                <Typography variant="body1">{student.email}</Typography>
                            </Stack>
                        </Box>
                        <Box>
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => navigate(`/students/${student._id}/edit`)}
                            >
                                Modifica
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Stats Section (if available) */}
                {stats && stats.media > 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                            <Stack direction="row" spacing={4} justifyContent="space-around">
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" fontWeight="bold">{stats.media}</Typography>
                                    <Typography variant="body2">Media Voti</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" fontWeight="bold">{stats.numero_esami}</Typography>
                                    <Typography variant="body2">Esami Sostenuti</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" fontWeight="bold">{stats.voto_massimo}</Typography>
                                    <Typography variant="body2">Voto Massimo</Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                )}

                {/* Modules Section */}
                <Grid item xs={12} md={6}>
                    <StudentModules modules={student.moduli} />
                </Grid>

                {/* Exams Section */}
                <Grid item xs={12} md={6}>
                    <StudentExams exams={student.esami} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default StudentDetail;
