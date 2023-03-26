import React, { useState } from "react";
import { GridColDef, GridRenderCellParams, GridRowId, GridToolbarContainer, GridToolbarFilterButton } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { ImportFilter, ExportFilter } from "./FilterIO";
import { CustomDataGrid } from "../datagrid/customDataGrid";
import { chipColor, onArrayFilterTypeChipClick } from "../chip/FilterTypeChip";
import { CustomToolbarItemStyle } from "../datagrid/toolbar";
import { useArrayFilterContext } from "../../context/ArrayFilter";
import { ArrayFilterInterface, ArrayFilterListInterface, FilterType } from "../../interface/filter";

const ChipListStyle = styled(Stack)({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    width: '100%',
    overflow: 'auto',
    lineHeight: '1.5',

    '.chip-label-filterBadgeImage': {
        display: 'inline-block',
        verticalAlign: 'middle',
    },
    '.MuiChip-outlined': {
        maxWidth: '10rem',
    }
})

export function ArrayFilterList() {
    const { arrayFilter, setArrayFilter } = useArrayFilterContext();
    const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([]);
    const [showDeleteButton, setShowDeleteButton] = React.useState(false);
    // const [arrayFilterEditButton, setArrayFilterEditButton] = useState(false);
    const { t } = useTranslation();

    const columns: GridColDef[] = [
        { 
            field: 'filters', headerName: t('common.filter'), flex: 0.6, 
            renderCell: (params: GridRenderCellParams<ArrayFilterInterface[]>) => {
                if(!params.value) return null;

                const chips = params.value.map(af => {
                    let title = `${t(`filter.type.${af.category || ''}`)}: ${af.value}`;
                    let badgeAvatar;

                    if(af.category === 'badge'){
                        const badgeUUID = af.value;
                        title = af.badgeName || '';
                        badgeAvatar = (
                            <Avatar 
                                alt={af.badgeName} 
                                src={`https://static-cdn.jtvnw.net/badges/v1/${badgeUUID}/1`} 
                                srcSet={`https://static-cdn.jtvnw.net/badges/v1/${badgeUUID}/1 1x,
                                https://static-cdn.jtvnw.net/badges/v1/${badgeUUID}/2 2x,
                                https://static-cdn.jtvnw.net/badges/v1/${badgeUUID}/3 4x`}
                            />
                        )
                    }
                    return (
                        <Tooltip key={title} title={title}>
                            <Chip
                                label={title}
                                avatar={badgeAvatar}
                                color={chipColor(af.type)}
                            />
                        </Tooltip >
                        
                    )
                });

                return (
                    <ChipListStyle direction='row'>
                        {chips}
                    </ChipListStyle>
                )
            }
        },
        {
            field: 'filterNote', headerName: "비고", flex: 0.2,
            renderCell: (params: GridRenderCellParams<string>) => {
                if(!params.value) return null;

                return (
                    <Chip
                        label={params.value}
                        color='secondary'
                    />
                )
            }
        },
        {
            field: 'filterType', headerName: t('common.condition'), flex: 0.2,
            renderCell: (params: GridRenderCellParams<FilterType>) => {
                if (!params.value) return null;

                return (
                    <Chip
                        label={t(`filter.category.${params.value}`)}
                        color={chipColor(params.value)}
                        onClick={() => onArrayFilterTypeChipClick(params, setArrayFilter)}
                    />
                )
            }
        }
    ];

    React.useEffect(() => {
        localStorage.setItem('tbc-filter', JSON.stringify(arrayFilter));
    }, [arrayFilter]);

    return (
        <CustomDataGrid 
            rows={arrayFilter}
            columns={columns}
            components={{ Toolbar: CustomToolbar }}
            componentsProps={{ 
                toolbar: {
                    selectionModel: selectionModel, 
                    showDeleteButton: showDeleteButton,
                    // showEditButton: arrayFilterEditButton
                }
            }}
            onSelectionModelChange={(ids) => {
                setShowDeleteButton(ids.length > 0);
                // setArrayFilterEditButton(ids.length > 0);
                setSelectionModel(ids);
            }}
            selectionModel={selectionModel}
        />
    )
}

function CustomToolbar(props: {
    selectionModel: GridRowId[], 
    showDeleteButton: boolean,
    // showEditButton: boolean
}) {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
            <ImportFilter />
            <ExportFilter />
            <DeleteButton selectionModel={props.selectionModel} showDeleteButton={props.showDeleteButton} />
            {/* <EditArrayFilterButton selectionModel={props.selectionModel} showEditButton={props.showEditButton}/> */}
        </GridToolbarContainer>
    );
}

// function EditArrayFilterButton(props: {selectionModel: GridRowId[], showEditButton: boolean}){
//     if (!props.showEditButton) return null;

//     const { arrayFilter, setArrayFilter } = useArrayFilterContext();

//     return (
//         <CustomToolbarItemStyle direction='row' onClick={() => { editArrayFilter(arrayFilter, setArrayFilter, props.selectionModel) }}>
//             <span className="material-icons-round">edit</span>
//             <span>선택 편집</span>
//         </CustomToolbarItemStyle>
//     )
// }

// function editArrayFilter(
//         arrayFilter: ArrayFilterListInterface[], 
//         setRows: React.Dispatch<React.SetStateAction<ArrayFilterListInterface[]>>, 
//         selectionModel: GridRowId[]) 
//     {

//     console.log('[common] ArrayFilterList editArrayFilter selectionModel: ', selectionModel);
//     /**
//      * 0. selectionModel 매개변수에서 편집 대상의 필터 ID 를 추출.
//      * 1. ArrayFilter 배열을 Map object 로 변환. 이때 key 는 ArrayFilter 의 ID.
//      * 2. 편집 후 Map object 를 다시 배열 형태로 변환한 다음 setRows 함수로 ArrayFilter 갱신.
//      */

//     const mArrayFilter = new Map(arrayFilter.map((e)=>[e.id, e]));

//     setRows(row => {
//         console.log('[common] ArrayFilterList editArrayFilter row: ', row)
//         return row;
//     });
// }

const DeleteButtonStyle = styled('div')({
    color: '#f44336'
})

function DeleteButton(props: { selectionModel: GridRowId[], showDeleteButton: boolean }) {
    const { setArrayFilter } = useArrayFilterContext();

    if (!props.showDeleteButton) return null;

    return (
        <DeleteButtonStyle>
            <CustomToolbarItemStyle direction='row' onClick={() => { deleteSelectedFilter(setArrayFilter, props.selectionModel) }}>
                <span className="material-icons-round">delete</span>
                <span>선택 삭제</span>
            </CustomToolbarItemStyle>
        </DeleteButtonStyle>
    )
}

function deleteSelectedFilter(setRows: React.Dispatch<React.SetStateAction<ArrayFilterListInterface[]>>, selectionModel: GridRowId[]) {
    setRows(row => {
        const newRow = row.filter(r => {
            return !selectionModel.includes(r.id);
        });
        return newRow;
    });
}