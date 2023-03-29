import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import FilterInputFormList from './FilterInputFormList';
import { AlertContext, ArrayFilterContext } from '../../context';
import useArrayFilter from '../../hooks/useArrayFilter';
import useAlert from '../../hooks/useAlert';
import { ArrayFilterInterface } from '../../interface/filter';

export default {
  title: 'FilterInputFormList',
  component: FilterInputFormList,
  argTypes: {
        backgroundColor: { control: 'color' },
    },
    decorators: [
        (Story) => {
            const { arrayFilter, setArrayFilter, addArrayFilter, checkFilter } =
                useArrayFilter('Extension', false);
            const alert = useAlert();

            return (
                <>
                    <ArrayFilterContext.Provider value={{ arrayFilter, setArrayFilter, addArrayFilter, checkFilter }}>
                        <AlertContext.Provider value={alert}>
                            <Story />
                        </AlertContext.Provider>
                    </ArrayFilterContext.Provider>
                </>
            )
        }
    ]
} as ComponentMeta<typeof FilterInputFormList>;

const Template: ComponentStory<typeof FilterInputFormList> = (args) => {
    const [filterInputList, setFilterInputList] = React.useState<ArrayFilterInterface[]>([]);
    const filterInputListRef = React.useRef<ArrayFilterInterface[]>([]);
    
    return (
        <FilterInputFormList {...args}
            afInputRow={filterInputList}
            setAfInputRow={setFilterInputList}
            filterInputListRef={filterInputListRef}
         />
    )
};

export const Primary = Template.bind({});
