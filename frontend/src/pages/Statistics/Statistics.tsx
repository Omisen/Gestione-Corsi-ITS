import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    TrendingUp as TrendingUpIcon,
    School as SchoolIcon,
    Assessment as AssessmentIcon,
    EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import statsService from '../../services/statsService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

const Statistics = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [overview, setOverview] = useState<any>(null);
    const [mediaVotiModuli, setMediaVotiModuli] = useState<any[]>([]);
    const [distribuzioneVoti, setDistribuzioneVoti] = useState<any[]>([]);
    const [esamiTemporali, setEsamiTemporali] = useState<any[]>([]);
    const [tassoSuccesso, setTassoSuccesso] = useState<any[]>([]);
    const [selectedModulo, setSelectedModulo] = useState<string>('');

    useEffect(() => {
        fetchAllStats();
    }, []);

    const fetchAllStats = async () => {
        try {
            setLoading(true);
            const [
                overviewData,
                mediaData,
                distribuzioneData,
                temporaleData,
                tassoData,
            ] = await Promise.all([
                statsService.getOverview(),
                statsService.getMediaVotiModuli(),
                statsService.getDistribuzioneVoti(),
                statsService.getEsamiTemporale(),
                statsService.getTassoSuccesso(),
            ]);

            setOverview(overviewData);
            setMediaVotiModuli(mediaData);
            setDistribuzioneVoti(distribuzioneData);
            setEsamiTemporali(temporaleData);
            setTassoSuccesso(tassoData);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Errore nel caricamento delle statistiche. Assicurati che il backend sia attivo.');
        } finally {
            setLoading(false);
        }
    };

    const handleModuloChange = async (event: any) => {
        const moduloId = event.target.value;
        setSelectedModulo(moduloId);
        try {
            const data = await statsService.getDistribuzioneVoti(moduloId || undefined);
            setDistribuzioneVoti(data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const kpiCards = overview ? [
        {
            title: 'Media Generale',
            value: overview.media_voti_generale.toFixed(2),
            icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
            color: '#1976d2',
            subtitle: `Range: ${overview.voto_minimo} - ${overview.voto_massimo}`,
        },
        {
            title: 'Tasso Successo',
            value: `${overview.tasso_successo_percentuale.toFixed(1)}%`,
            icon: <TrophyIcon sx={{ fontSize: 40 }} />,
            color: '#2e7d32',
            subtitle: `${overview.esami_promossi}/${overview.totale_esami} promossi`,
        },
        {
            title: 'Totale Esami',
            value: overview.totale_esami,
            icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
            color: '#ed6c02',
            subtitle: 'Esami sostenuti',
        },
        {
            title: 'Studenti Attivi',
            value: overview.totale_studenti,
            icon: <SchoolIcon sx={{ fontSize: 40 }} />,
            color: '#9c27b0',
            subtitle: `${overview.totale_moduli} moduli disponibili`,
        },
    ] : [];

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                    Statistiche e Analisi
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Dashboard completa con metriche, grafici e trend del sistema
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, boxShadow: 1 }}>
                    {error}
                </Alert>
            )}

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {kpiCards.map((card, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                        <Card sx={{ boxShadow: 3, borderRadius: 2, height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                                            {card.title}
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: card.color, my: 1 }}>
                                            {card.value}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {card.subtitle}
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

            {/* Charts Grid */}
            <Grid container spacing={3}>
                {/* Media Voti per Modulo */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Media Voti per Modulo
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={mediaVotiModuli.slice(0, 5)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nome_modulo" angle={-45} textAnchor="end" height={100} />
                                <YAxis domain={[0, 30]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="media_voto" fill="#1976d2" name="Media Voto" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Distribuzione Voti */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Distribuzione Voti
                            </Typography>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Modulo</InputLabel>
                                <Select value={selectedModulo} onChange={handleModuloChange} label="Modulo">
                                    <MenuItem value="">Tutti</MenuItem>
                                    {mediaVotiModuli.map((m) => (
                                        <MenuItem key={m._id} value={m._id}>
                                            {m.codice_modulo}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={distribuzioneVoti}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {distribuzioneVoti.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Trend Temporale Esami */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Trend Esami nel Tempo
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={esamiTemporali}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="periodo" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" domain={[0, 30]} />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="numero_esami" stroke="#1976d2" name="N° Esami" strokeWidth={2} />
                                <Line yAxisId="right" type="monotone" dataKey="media_voto" stroke="#2e7d32" name="Media Voto" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Tasso Successo per Modulo */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Tasso di Successo per Modulo
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={tassoSuccesso.slice(0, 5)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="nome_modulo" type="category" width={150} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="percentuale_successo" fill="#2e7d32" name="% Successo" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Statistics;
