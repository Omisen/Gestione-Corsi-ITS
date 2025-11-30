import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Divider,
} from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import type { Exam, Module } from '../../types/types';

interface StudentExamsProps {
    exams: (string | Exam)[];
}

const StudentExams = ({ exams }: StudentExamsProps) => {
    // Helper to safely get exam data
    const getExamData = (exam: string | Exam) => {
        if (typeof exam === 'string') {
            return null;
        }
        return exam;
    };

    const getModuleName = (mod: string | Module) => {
        if (typeof mod === 'string') return 'Modulo sconosciuto';
        return mod.nome;
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('it-IT');
        } catch (e) {
            return dateString;
        }
    };

    const getGradeColor = (grade: number) => {
        if (grade >= 28) return 'success';
        if (grade >= 24) return 'primary';
        if (grade >= 18) return 'warning';
        return 'error';
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AssignmentIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2">
                        Esami Sostenuti
                    </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {exams.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        Nessun esame registrato.
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Data</TableCell>
                                    <TableCell>Modulo</TableCell>
                                    <TableCell align="right">Voto</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {exams.map((examItem, index) => {
                                    const exam = getExamData(examItem);
                                    if (!exam) return null;

                                    return (
                                        <TableRow key={exam._id || index}>
                                            <TableCell>{formatDate(exam.data)}</TableCell>
                                            <TableCell>{getModuleName(exam.modulo)}</TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={exam.voto}
                                                    size="small"
                                                    color={getGradeColor(exam.voto)}
                                                    sx={{ fontWeight: 'bold', minWidth: 40 }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default StudentExams;
