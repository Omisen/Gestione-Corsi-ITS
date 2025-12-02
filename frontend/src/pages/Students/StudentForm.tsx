import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Stack,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { studentService } from '../../services/studentService';
import type { StudentFormData } from '../../types/types';

const StudentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<StudentFormData>();

    useEffect(() => {
        if (isEditMode && id) {
            const fetchStudent = async () => {
                try {
                    setLoading(true);
                    const student = await studentService.getStudentById(id);
                    setValue('nome', student.nome);
                    setValue('cognome', student.cognome);
                    setValue('email', student.email);
                } catch (err) {
                    console.error(err);
                    setError('Errore nel caricamento dei dati dello studente.');
                } finally {
                    setLoading(false);
                }
            };
            fetchStudent();
        }
    }, [isEditMode, id, setValue]);

    const onSubmit = async (data: StudentFormData) => {
        try {
            setLoading(true);
            setError(null);

            if (isEditMode && id) {
                await studentService.updateStudent(id, data);
            } else {
                await studentService.createStudent(data);
            }

            navigate('/students');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.Errore || 'Si è verificato un errore durante il salvataggio.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box maxWidth="md" sx={{ mx: 'auto', p: { xs: 2, sm: 3 } }}>
            <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/students')}
                    color="inherit"
                    size="small"
                >
                    Indietro
                </Button>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main', fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                    {isEditMode ? 'Modifica Studente' : 'Nuovo Studente'}
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, boxShadow: 1 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, boxShadow: 3, borderRadius: 2 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={3}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <TextField
                                label="Nome"
                                variant="outlined"
                                fullWidth
                                {...register('nome', { required: 'Il nome è obbligatorio' })}
                                error={!!errors.nome}
                                helperText={errors.nome?.message}
                            />
                            <TextField
                                label="Cognome"
                                variant="outlined"
                                fullWidth
                                {...register('cognome', { required: 'Il cognome è obbligatorio' })}
                                error={!!errors.cognome}
                                helperText={errors.cognome?.message}
                            />
                        </Box>

                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            type="email"
                            {...register('email', {
                                required: 'L\'email è obbligatoria',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Indirizzo email non valido',
                                },
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/students')}
                                disabled={loading}
                                fullWidth={{ xs: true, sm: false }}
                            >
                                Annulla
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                disabled={loading}
                                fullWidth={{ xs: true, sm: false }}
                            >
                                {isEditMode ? 'Aggiorna' : 'Salva'}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default StudentForm;
