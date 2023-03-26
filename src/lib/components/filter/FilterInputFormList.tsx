import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { SelectChangeEvent } from '@mui/material/Select';
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from '@mui/material/Paper';
import {
    ArrayFilterInterface,
    ArrayFilterCategory,
    FilterType
} from "../../interface/filter";
import { useArrayFilterContext } from '../../context/ArrayFilter';
import { nanoid } from 'nanoid';
import { ArrayFilterCategorySelector, ArrayFilterSelectorType, ArrayFilterTypeSelector } from './ArrayFilterComponents';

export default function FilterInputFormList(
    props: {
        afInputRow: ArrayFilterInterface[],
        setAfInputRow: React.Dispatch<React.SetStateAction<ArrayFilterInterface[]>>,
        filterInputListRef: React.MutableRefObject<ArrayFilterInterface[]>
    }
) {
    const { addArrayFilter } = useArrayFilterContext();
    const [arrayFilterType, setArrayFilterType] = React.useState<FilterType>('include');
    const [arrayFilterNote, setArrayFilterNote] = useState('');
    const [nameFilterAvail, setNameFilterAvail] = React.useState(false);
    const { t } = useTranslation();

    const addFilterInputForm = () => {
        props.setAfInputRow(list => {
            return [...list, {
                category: nameFilterAvail ? 'keyword' : 'name',
                id: nanoid(),
                type: 'include',
                value: ''
            }]
        });
    }
    const onArrayFilterTypeChanged = (event: SelectChangeEvent<FilterType>) => {
        setArrayFilterType(event.target.value as FilterType);
    }
    const onArrayFilterNoteChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setArrayFilterNote(event.target.value);
    }
    const addFilter = useCallback(() => {
        const added = addArrayFilter([{
            filterType: arrayFilterType,
            id: nanoid(),
            filterNote: arrayFilterNote,
            filters: [...props.filterInputListRef.current]
        }]);
        if (added) {
            props.setAfInputRow([]);
        }
    }, [arrayFilterType, arrayFilterNote])

    React.useEffect(() => {
        const rows = props.afInputRow;
        
        props.filterInputListRef.current = rows;

        setNameFilterAvail(rows.some(row => row.category === 'name'));
    }, [props.afInputRow]);

    return (
        <Card variant="outlined" sx={{overflow: 'visible'}}>
            <CardContent sx={{display: 'flex', minHeight: '22rem'}}>
                {
                    props.afInputRow.length > 0 ? (
                        <Stack spacing={2} sx={{width: '100%'}}>
                            {
                                props.afInputRow.map(input => {
                                    return (
                                        <FilterInputForm
                                            key={input.id}
                                            value={input}
                                            setInputList={props.setAfInputRow}
                                            afInputListRef={props.filterInputListRef}
                                            nameFilterAvail={nameFilterAvail}
                                        ></FilterInputForm>
                                    )
                                })
                            }
                        </Stack>

                    ) : (
                        <Stack justifyContent='center' alignItems='center' sx={{ 'width': '100%' }}>
                            <Typography color='textSecondary' variant="subtitle1" gutterBottom>
                                {t('common.add_filter_elements')}
                            </Typography>
                        </Stack>

                    )
                }
            </CardContent>
            <CardActions>
                <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}}>
                    <Button onClick={addFilterInputForm}>
                        {t('common.add_filter_element')}
                    </Button>
                    <CustomTextField
                        label={t('필터 설명을 추가하세요')}
                        onChange={onArrayFilterNoteChanged}
                    />
                    <Stack direction='row' gap={1}>
                        <ArrayFilterTypeSelector 
                            labelId="arrayFilterType"
                            value={arrayFilterType} 
                            onChange={onArrayFilterTypeChanged}
                        />
                        <Button
                            disabled={props.afInputRow.length === 0}
                            onClick={addFilter}
                            variant='contained'
                        >
                            {t('common.add_filter')}
                        </Button>
                    </Stack>
                </Stack>
            </CardActions>
        </Card>
    )
}

function FilterInputForm(props: {
    value: ArrayFilterInterface,
    setInputList: React.Dispatch<React.SetStateAction<ArrayFilterInterface[]>>,
    afInputListRef: React.MutableRefObject<ArrayFilterInterface[]>,
    nameFilterAvail: boolean
}) {
    const { t } = useTranslation();
    const inputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        const inputRef = props.afInputListRef.current;
        const newInputRef = inputRef.map(l => {
            if (l.id === props.value.id) {
                if (l.category === 'badge') {
                    l.badgeName = newValue;
                } else {
                    l.value = newValue;
                }
            }
            return l;
        });

        props.afInputListRef.current = newInputRef;
    }

    const selectorChanged = (event: SelectChangeEvent<ArrayFilterCategory | FilterType>, selectorType: ArrayFilterSelectorType) => {
        const newValue = event.target.value;

        props.setInputList(list => {
            return list.map(l => {
                if (l.id === props.value.id) {
                    if (selectorType === 'category') {
                        l.category = newValue as ArrayFilterCategory;
                    } else if (selectorType === 'type') {
                        l.type = newValue as FilterType;
                    }
                }
                return l;
            });
        });
    }

    const removeList = (event: React.MouseEvent<HTMLElement>, id: string) => {
        props.setInputList(list => list.filter(l => l.id !== id));
    }

    return (
        <Stack direction='row' spacing={1}>
            {
                props.value.category === 'badge' ? (
                    <>
                        <Paper 
                            variant="outlined" 
                            sx={{ 
                                minWidth: 120,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <img
                                src={`https://static-cdn.jtvnw.net/badges/v1/${props.value.value}/1`}
                                srcSet={
                                    `https://static-cdn.jtvnw.net/badges/v1/${props.value.value}/1 1x, 
                            https://static-cdn.jtvnw.net/badges/v1/${props.value.value}/2 2x, 
                            https://static-cdn.jtvnw.net/badges/v1/${props.value.value}/3 4x`}
                            />
                        </Paper>

                        <CustomTextField
                            label={t('common.badge_name')}
                            defaultValue={props.value.badgeName}
                            onChange={inputChanged}
                        />
                    </>
                ) : (
                    <>
                        <ArrayFilterCategorySelector 
                            value={props.value.category}
                            onChange={(e) => selectorChanged(e, 'category')}
                            nameFilterAvail={props.nameFilterAvail}
                        />

                        <CustomTextField
                            label={t('common.value')}
                            defaultValue={props.value.value}
                            onChange={inputChanged}
                        />
                    </>
                )
            }

            <ArrayFilterTypeSelector
                labelId="filter-type-label"
                value={props.value.type}
                onChange={(e) => selectorChanged(e, 'type')}
            />

            <Button onClick={(e) => removeList(e, props.value.id)}>{t('common.remove')}</Button>
        </Stack>
    )
}

function CustomTextField(props: TextFieldProps) {
    return <TextField {...props}
        id="outlined-basic"
        variant="outlined"
        size="small"
        fullWidth
    />
}