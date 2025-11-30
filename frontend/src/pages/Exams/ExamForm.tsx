import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Stack,
    Alert,
    CircularProgress,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { examService } from '../../services/examService';
import { studentService } from '../../services/studentService';
import { moduleService } from '../../services/moduleService';
import type { ExamFormData } from '../../types/types';

const ExamForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [modules, setModules] = useState<any[]>([]);

    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<ExamFormData>();

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [sData, mData] = await Promise.all([
                    studentService.getAllStudents(),
                    moduleService.getAllModules(),
                ]);
                setStudents(sData);
                setModules(mData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        if (isEditMode && id) {
            const fetchExam = async () => {
                try {
                    setLoading(true);
                    const exam = await examService.getExamById(id);
                    setValue('studente_id', typeof exam.studente === 'string' ? exam.studente : exam.studente._id);
                    setValue('modulo_id', typeof exam.modulo === 'string' ? exam.modulo : exam.modulo._id);
                    setValue('data', exam.data.split('T')[0]);
                    setValue('voto', exam.voto as any);
                    setValue('note', exam.note || '');
                } catch (err) {
                    console.error(err);
                    setError('Errore nel caricamento dei dati dell\'esame.');
                } finally {
                    setLoading(false);
                }
            };
            fetchExam();
        }
    }, [isEditMode, id, setValue]);

    const onSubmit = async (data: ExamFormData) => {
        try {
            setLoading(true);
            setError(null);

            if (isEditMode && id) {
                await examService.updateExam(id, data);
            } else {
                await examService.createExam(data);
            }

            navigate('/exams');
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
        <Box maxWidth="md" sx={{ mx: 'auto' }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/exams')}
                    color="inherit"
                >
                    Indietro
                </Button>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    {isEditMode ? 'Modifica Esame' : 'Nuovo Esame'}
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={3}>
                        <FormControl fullWidth>
                            <InputLabel id="student-label">Studente</InputLabel>
                            <Controller
                                name="studente_id"
                                control={control}
                                rules={{ required: 'Seleziona uno studente' }}
                                render={({ field }) => (
                                    <Select labelId="student-label" label="Studente" {...field}>
                                        {students.map((s) => (
                                            <MenuItem key={s._id} value={s._id}>{`${s.nome} ${s.cognome}`}</MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="module-label">Modulo</InputLabel>
                            <Controller
                                name="modulo_id"
                                control={control}
                                rules={{ required: 'Seleziona un modulo' }}
                                render={({ field }) => (
                                    <Select labelId="module-label" label="Modulo" {...field}>
                                        {modules.map((m) => (
                                            <MenuItem key={m._id} value={m._id}>{m.nome}</MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>

                        <TextField
                            label="Data"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            {...register('data', { required: 'La data è obbligatoria' })}
                            error={!!errors.data}
                            helperText={errors.data?.message}
                        />

                        <TextField
                            label="Voto"
                            type="number"
                            fullWidth
                            {...register('voto', { required: 'Il voto è obbligatorio', min: { value: 0, message: 'Valore non valido' } })}
                            error={!!errors.voto}
                            helperText={errors.voto?.message}
                        />

                        <TextField
                            label="Note"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            {...register('note')}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/exams')}
                                disabled={loading}
                            >
                                Annulla
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                disabled={loading}
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

export default ExamForm;
