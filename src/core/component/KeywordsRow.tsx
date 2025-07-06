import { Chip, Stack } from "@mui/material";

type KeywordsRowProps = {
    keywords: string[]
    addKeyword: () => void
    deleteKeyword: (index: number) => void
}

export default function KeywordsRow(
    { keywords, addKeyword, deleteKeyword }: KeywordsRowProps
) {
    return (
        <Stack 
            direction="row" 
            spacing={1}
            sx={{
                flexWrap: 'wrap',
                gap: 1,
                // Remove default spacing when wrapping
                '& > *': {
                    margin: '4px !important'
                }
            }}
        >
            {keywords.map((keyword, index) => (
                <Chip 
                    key={index} 
                    label={keyword} 
                    onDelete={() => deleteKeyword(index)}
                    sx={{
                        '& .MuiChip-label': {
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'text.primary',
                            paddingX: 1.5
                        },
                        '& .MuiChip-deleteIcon': {
                            fontSize: '1.25rem',
                            color: 'text.secondary',
                            '&:hover': {
                                color: 'error.main'
                            }
                        }
                    }}
                />
            ))}
            <Chip 
                label="+" 
                onClick={() => addKeyword()}
                sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiChip-label': {
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        paddingX: 2
                    },
                    '&:hover': {
                        backgroundColor: 'primary.dark'
                    },
                    cursor: 'pointer'
                }}
            />
        </Stack>
    )
}