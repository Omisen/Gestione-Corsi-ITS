import {
    Box,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Divider,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import type { Module } from '../../types/types';

interface StudentModulesProps {
    modules: (string | Module)[];
}

const StudentModules = ({ modules }: StudentModulesProps) => {
    // Helper to safely get module data whether it's populated or just an ID
    const getModuleData = (mod: string | Module) => {
        if (typeof mod === 'string') {
            return { nome: 'Modulo non caricato', codice: mod, totale_ore: 0 };
        }
        return mod;
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2">
                        Moduli Iscritti
                    </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {modules.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        Nessun modulo associato.
                    </Typography>
                ) : (
                    <List disablePadding>
                        {modules.map((mod, index) => {
                            const moduleData = getModuleData(mod);
                            return (
                                <ListItem
                                    key={typeof mod === 'string' ? mod : mod._id}
                                    disableGutters
                                    sx={{
                                        borderBottom: index < modules.length - 1 ? '1px solid #f1f5f9' : 'none',
                                        py: 1.5,
                                    }}
                                >
                                    <ListItemText
                                        primary={moduleData.nome}
                                        secondary={`Codice: ${moduleData.codice}`}
                                        primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                    <Chip
                                        label={`${moduleData.totale_ore} ore`}
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </CardContent>
        </Card>
    );
};

export default StudentModules;
