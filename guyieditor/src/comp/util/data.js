
const propT = [
    {
        type: 'Row',
        props: [
            { name: 'Main', prop: 'justifyContent', type: 'select,flex-start,center,space-around,space-evenly,space-between,flex-end', value: 'flex-start' },
            { name: 'Sec', prop: 'alignItems', type: 'select,flex-start,stretch,center,flex-end', value: 'flex-start' },
            { name: 'AlignSelf', prop: 'alignSelf', type: 'select,flex-start,stretch,center,flex-end', value: 'flex-start' },
            { name: 'Wrap', prop: 'flexWrap', type: 'select,nowrap,wrap,wrap-reverse', value: 'no-wrap' },
            { name: 'Back color', prop: 'backgroundColor', type: 'color', value: '#fff' },
            { name: 'Width', prop: 'width', type: 'number', value: 0 },
            { name: 'Height', prop: 'height', type: 'number', value: 0 },
            { name: 'Border', prop: 'border', type: 'text', value: '' },
            { name: 'Margin', prop: 'margin', type: 'number', value: 0 },
            { name: 'Padding', prop: 'padding', type: 'number', value: 0 },
            { name: 'BoxShadow', prop: 'boxShadow', type: 'text', value: '' },
            { name: 'Radius', prop: 'borderRadius', type: 'number', value: 0 },
            { name: 'background', prop: 'background', type: 'text', value: '' },
            { name: 'Flex', prop: 'flex', type: 'number', value: 0 },
            { name: 'Overflow', prop: 'overflow', type: 'select,visible,hidden,auto,scroll' },
            { name: 'Class', prop: 'className', type: 'text', value: '' },
            { name: 'DomId', prop: 'id', type: 'text', value: '' },
            { name: 'Children', prop: 'children', type: 'comps', value: [] },
        ]
    },
    {
        type: 'Column',
        props: [
            { name: 'Main', prop: 'justifyContent', type: 'select,flex-start,center,space-around,space-evenly,space-between,flex-end', value: 'flex-start' },
            { name: 'Sec', prop: 'alignItems', type: 'select,flex-start,stretch,center,flex-end', value: 'flex-start' },
            { name: 'AlignSelf', prop: 'alignSelf', type: 'select,flex-start,stretch,center,flex-end', value: 'flex-start' },
            { name: 'Wrap', prop: 'flexWrap', type: 'select,nowrap,wrap,wrap-reverse', value: 'no-wrap' },
            { name: 'Back color', prop: 'backgroundColor', type: 'color', value: '#fff' },
            { name: 'Width', prop: 'width', type: 'number', value: 0 },
            { name: 'Height', prop: 'height', type: 'number', value: 0 },
            { name: 'Border', prop: 'border', type: 'text', value: '' },
            { name: 'Margin', prop: 'margin', type: 'number', value: 0 },
            { name: 'Padding', prop: 'padding', type: 'number', value: 0 },
            { name: 'BoxShadow', prop: 'boxShadow', type: 'text', value: '' },
            { name: 'background', prop: 'background', type: 'text', value: '' },
            { name: 'Flex', prop: 'flex', type: 'number', value: 0 },
            { name: 'Radius', prop: 'borderRadius', type: 'number', value: 0 },
            { name: 'Overflow', prop: 'overflow', type: 'select,visible,hidden,auto,scroll' },
            { name: 'Class', prop: 'className', type: 'text', value: '' },
            { name: 'DomId', prop: 'id', type: 'text', value: '' },
            { name: 'Children', prop: 'children', type: 'comps', value: [] },
        ]
    },
    {
        type: 'View',
        props: [
            { name: 'Main', prop: 'justifyContent', type: 'select,flex-start,center,space-around,space-evenly,space-between,flex-end', value: 'flex-start' },
            { name: 'Sec', prop: 'alignItems', type: 'select,flex-start,stretch,center,flex-end', value: 'flex-start' },
            { name: 'Center', prop: 'center', type: 'bool', value: true },
            { name: 'AlignSelf', prop: 'alignSelf', type: 'select,flex-start,stretch,center,flex-end', value: 'stretch' },
            { name: 'Flex', prop: 'flex', type: 'number', value: 0 },
            { name: 'Back color', prop: 'backgroundColor', type: 'color', value: '#fff' },
            { name: 'Width', prop: 'width', type: 'number', value: 0 },
            { name: 'Height', prop: 'height', type: 'number', value: 0 },
            { name: 'BoxShadow', prop: 'boxShadow', type: 'text', value: '' },
            { name: 'background', prop: 'background', type: 'text', value: '' },
            { name: 'Overflow', prop: 'overflow', type: 'select,visible,hidden,auto,scroll', value: 'visible' },
            { name: 'Cursor', prop: 'cursor', type: 'select,copy,crosshair,grab,help,move,no-drop,none,not-allowed,pointer,progress,revert,row-resize,text,unset,wait,zoom-in,zoom-out', value: 'select' },
            { name: 'Margin', prop: 'margin', type: 'number', value: 0 },
            { name: 'MT', prop: 'marginTop', type: 'number', value: 0 },
            { name: 'MR', prop: 'marginRight', type: 'number', value: 0 },
            { name: 'MB', prop: 'marginBottom', type: 'number', value: 0 },
            { name: 'ML', prop: 'marginLeft', type: 'number', value: 0 },
            { name: 'Padding', prop: 'padding', type: 'number', value: 0 },
            { name: 'PT', prop: 'paddingTop', type: 'number', value: 0 },
            { name: 'PR', prop: 'paddingRight', type: 'number', value: 0 },
            { name: 'PB', prop: 'paddingBottom', type: 'number', value: 0 },
            { name: 'PL', prop: 'paddingLeft', type: 'number', value: 0 },
            { name: 'Radius', prop: 'borderRadius', type: 'number', value: 0 },
            { name: 'RTL', prop: 'borderTopLeftRadius', type: 'number', value: 0 },
            { name: 'RTR', prop: 'borderTopRightRadius', type: 'number', value: 0 },
            { name: 'RBL', prop: 'borderBottomLeftRadius', type: 'number', value: 0 },
            { name: 'RBR', prop: 'borderBottomRightRadius', type: 'number', value: 0 },
            { name: 'Border', prop: 'border', type: 'text', value: '' },
            { name: 'BT', prop: 'borderTop', type: 'text', value: '' },
            { name: 'BR', prop: 'borderRight', type: 'text', value: '' },
            { name: 'BB', prop: 'borderBottom', type: 'text', value: '' },
            { name: 'BL', prop: 'borderLeft', type: 'text', value: '' },
            { name: 'Positon', prop: 'position', type: 'select,static,absolute,fixed,relative,sticky,initial,inherit', value: '' },
            { name: 'Left', prop: 'left', type: 'number', value: 0 },
            { name: 'Right', prop: 'right', type: 'number', value: 0 },
            { name: 'Bottom', prop: 'bottom', type: 'number', value: 0 },
            { name: 'Top', prop: 'top', type: 'number', value: 0 },
            { name: 'Opacity', prop: 'opacity', type: 'number', value: 0 },
            { name: 'BackgroundImage', prop: 'backgroundImage', type: 'text', value: '' },
            { name: 'BackgroundRepeat', prop: 'backgroundRepeat', type: 'select,repeat,no-repeat,repeat-x,repeat-y,space,round', value: 'no-repeat' },
            { name: 'BackgroundSize', prop: 'backgroundSize', type: 'select,cover,auto,contain', value: 'cover' },
            { name: 'Class', prop: 'className', type: 'text', value: '' },
            { name: 'DomId', prop: 'id', type: 'text', value: '' },
            { name: 'Child', prop: 'child', type: 'comp', value: [] },
        ]
    },
    {
        type: 'Text',
        props: [
            { name: 'Value', prop: 'value', type: 'text', value: '   ' },
            { name: 'FontSize', prop: 'fontSize', type: 'number', value: 16 },
            { name: 'Color', prop: 'color', type: 'color', value: '#333' },
            { name: 'Style', prop: 'color', type: 'select,narmal,italic,obligue,inherit,initial', value: 'normal' },
            { name: 'FontWeight', prop: 'fontWeight', type: 'select,normal,bold,bolder' },
            { name: 'Decoration', prop: 'textDecoration', type: 'select,none,underline,line-through,overline' },
            { name: 'TextAlign', prop: 'textAlign', type: 'select,left,center,right', value: 'left' },
            { name: 'Margin', prop: 'margin', type: 'number', value: 0 },
            { name: 'Padding', prop: 'padding', type: 'number', value: 0 },
            { name: 'Class', prop: 'className', type: 'text', value: '' },
            { name: 'DomId', prop: 'id', type: 'text', value: '' },

        ]
    },
    {
        type: 'Button',
        props: [
            { name: 'Value', prop: 'value', type: 'text', value: '   ' },
            { name: 'Color', prop: 'color', type: 'color', value: '#333' },
            { name: 'FontSize', prop: 'number', type: 'number', value: 16 },
            { name: 'BackColor', prop: 'backgroundColor', type: 'color', value: 'white' },
            { name: 'Radius', prop: 'borderRadius', type: 'number', value: 0 },
            { name: 'Width', prop: 'width', type: 'number', value: 0 },
            { name: 'Height', prop: 'height', type: 'number', value: 0 },
        ]
    },
    {
        type: 'Image',
        props: [
            { name: 'Source', prop: 'src', type: 'res', value: '' },
            { name: 'Width', prop: 'width', type: 'number', value: 80 },
            { name: 'Height', prop: 'height', type: 'number', value: 80 },
            { name: 'Radius', prop: 'borderRadius', type: 'number', value: 0 },
            { name: 'Border', prop: 'border', type: 'text', value: '' },
            { name: 'ObjectFit', prop: 'objectFit', type: 'select,fill,contain,cover,none,scale-down', value: '' },
        ]
    },
    {
        type: 'TextInput',
        props: [
            { name: 'Value', type: 'text', prop: 'value', value: '', },
            { name: 'Width', type: 'number', prop: 'width', value: 'auto', },
            { name: 'Height', type: 'number', prop: 'height', value: 'auto' },
            { name: 'Border', type: 'text', prop: 'border', value: '' },
            { name: 'Type', prop: 'type', value: 'text', type: "select,button,checkbox,color,date,datetime-local,email,file,hidden,image,month,number,password,radio,range,reset,search,submit,tel,text,time,url" },
            { name: 'Accept', prop: 'accept', type: 'text', value: '' },
            { name: 'Autocomplete', prop: 'autocomplete', type: 'bool', value: false },
            { name: 'Checked', prop: 'checked', type: 'bool', value: false },
            { name: 'Disabled', prop: 'disabled', type: 'bool', value: false },
            { name: 'Max', prop: 'max', type: 'number', value: 0 },
            { name: 'Min', prop: 'min', type: 'number', value: 0 },
            { name: 'Multiple', prop: 'multiple', type: 'bool', value: false },
            { name: 'Name', prop: 'name', type: 'text', value: '' },
            { name: 'Placeholder', prop: 'placeholder', type: 'text', value: '' },
            { name: 'Readonly', prop: 'readonly', type: 'text', value: '' },
            { name: 'Pattern', prop: 'pattern', type: 'text', value: '' },
            { name: 'Step', prop: 'step', type: 'number', value: 1 },
            { name: 'Class', prop: 'className', type: 'text', value: '' },
            { name: 'DomId', prop: 'id', type: 'text', value: '' },

        ]
    },
    {//maplist
        type: 'MapList',
        props: [
            { name: 'Template', prop: 'Template', type: 'text', value: '' },
            { name: 'Mapping', prop: 'Mapping', type: 'json', value: '{}' },
            { name: 'Extras', prop: 'Extras', type: 'json', value: '{}', },
            { name: 'FormatInfo', prop: 'FormatInfo', type: 'json', value: '{}', },
            { name: 'Data', prop: 'Data', type: 'mapdata,none', value: '[]' },
        ]
    },
    {
        type: 'CondList',
        props: [
            { name: 'Extras', prop: 'Extras', type: 'json', value: {} },
            { name: 'Routes', prop: 'Routes', type: 'conditional', value: [] },
        ]
    },
    {
        type: 'Html',
        props: [
            { name: 'Html', prop: 'Html', type: 'html', value: '' },
            { name: 'Width', prop: 'Width', type: 'number', value: '100%' },
            { name: 'Height', prop: 'Height', type: 'number', value: '100%' },
            { name: 'Class', prop: 'className', type: 'text', value: '' },
            { name: 'DomId', prop: 'id', type: 'text', value: '' },
        ]
    },
    {
        type: 'Icon', props: [
            { name: 'Size', prop: 'Size', type: 'number', value: 30 },
            { name: 'Color', prop: 'Color', type: 'color', value: '#333' },
            { name: 'Class', prop: 'className', type: 'text', value: '' },
            { name: 'DomId', prop: 'id', type: 'text', value: '' },
        ]
    },
    {
        type: 'Ripples', props: [
            { name: 'Color', prop: 'Color', type: 'color', value: '' },
            { name: 'During', prop: 'During', type: 'number', value: '' },
            { name: 'Child', prop: 'Child', type: 'comp', value: [] },
        ]
    },
    {
        type: 'Video', props: [
            { name: 'Src', prop: 'src', type: 'res', value: '' },
            { name: 'Controls', prop: 'controls', type: 'bool', value: false },
            { name: 'Width', prop: 'width', type: 'number', value: 0 },
            { name: 'Height', prop: 'height', type: 'number', value: 0 },
            { name: 'Autoplay', prop: 'autoplay', type: 'bool', value: false },
            { name: 'Mute', prop: 'mute', type: 'bool', value: false },
            { name: 'Loop', prop: 'loop', type: 'bool', value: false },
            { name: 'Radius', prop: 'borderRadius', type: 'number', value: 0 },
            { name: 'Border', prop: 'border', type: 'text', value: '' },
            { name: 'ObjectFit', prop: 'objectFit', type: 'select,fill,contain,cover,none,scale-down', value: '' },
            { name: 'Class', prop: 'className', type: 'text', value: '' },
            { name: 'DomId', prop: 'id', type: 'text', value: '' },
        ]
    },
    {
        type: 'Audio', props: [
            { name: 'Src', prop: 'src', type: 'text', value: '' },
            { name: 'Controls', prop: 'controls', type: 'bool', value: false },
            { name: 'Width', prop: 'width', type: 'number', value: 0 },
            { name: 'Height', prop: 'height', type: 'number', value: 0 },
            { name: 'Autoplay', prop: 'autoplay', type: 'bool', value: false },
            { name: 'Mute', prop: 'mute', type: 'bool', value: false },
            { name: 'Loop', prop: 'loop', type: 'bool', value: false },
            { name: 'Radius', prop: 'borderRadius', type: 'number', value: 0 },
            { name: 'Border', prop: 'border', type: 'text', value: '' },
            { name: 'ObjectFit', prop: 'objectFit', type: 'select,fill,contain,cover,none,scale-down', value: '' },
            { name: 'Class', prop: 'className', type: 'text', value: '' },
            { name: 'DomId', prop: 'id', type: 'text', value: '' },
        ]
    },
    {
        type: 'ReactRaw', props: [
            { name: 'Function', prop: 'Function', type: 'text', value: '' },
            { name: 'Children', prop: 'Children', type: 'comps', value: [] },
        ]
    },
    {//mbutton
        type: 'MButton',
        props: [
            { name: 'Value', prop: 'Value', type: 'text', value: '' },
            { name: 'Variant', prop: 'Variant', type: 'select,contained,outlined,text', value: 'contained' },
            { name: 'Color', prop: 'Color', type: 'select,primary,secondary,default', value: '' },
            { name: 'Size', prop: 'Size', type: 'select,small,medium,large' },
            { name: 'Disabled', prop: 'Disabled', type: 'bool', value: false },
            { name: 'Elevation', prop: 'Elevation', type: 'bool', value: false },
        ]
    },
    {
        type: 'MTextField',
        props: [
            { name: 'Value', prop: 'Value', type: 'text', value: '' },
            { name: 'Label', prop: 'Label', type: 'text', value: '' },
            { name: 'Color', prop: 'Color', type: 'select,primary,secondary,stardard', value: '' },
            { name: 'Size', prop: 'Size', type: 'select,small,medium,large', value: 'medium' },
            { name: 'Type', prop: 'Type', type: 'select,text,number,checkbox,radio,label', value: 'text' },
            { name: 'Variant', prop: 'Variant', type: 'select,default,filled,outlined', value: 'standard' },
            { name: 'Error', prop: 'Error', type: 'bool', value: false },
            { name: 'HelperText', prop: 'HelperText', type: 'text', value: '' },
            { name: 'Multiline', prop: 'Multiline', type: 'bool', value: false },
            { name: 'Margin', prop: 'Margin', type: 'select,none,dense,normal' },
            { name: 'Disabled', prop: 'Disabled', type: 'bool', value: false },
            { name: 'Width', prop: 'Width', type: 'number', value: 0 },

        ]
    },
    {
        type: 'MAvatar',
        props: [
            { name: 'Alt', prop: 'Alt', type: 'text', value: '' },
            { name: 'Source', prop: 'Source', type: 'text', value: '' },
            { name: 'Variant', prop: 'Variant', type: 'select,square,rounded,circular', value: 'circular' },
            { name: 'Width', prop: 'Width', type: 'number', value: 0 },
            { name: 'Height', prop: 'Height', type: 'number', value: 0 },

        ]
    },
    {
        type: 'MBadge',
        props: [
            { name: 'Value', prop: 'Value', type: 'number', value: 0 },
            { name: 'Color', prop: 'Color', type: 'select,primary,secondary,standard', value: '#333' },
            { name: 'Vertical', prop: 'Vertical', type: 'select,top,bottom', value: 'top' },
            { name: 'Horizontal', prop: 'Horizontal', type: 'select,right,left', value: 'right' },
            { name: 'ShowZero', prop: 'ShowZero', type: 'bool', value: 'false' },
            { name: 'Variant', prop: 'Variant', type: 'select,dot,standard', value: 'standard' },
            { name: 'Disabled', prop: 'Disabled', type: 'bool', value: false },
            { name: 'Overlap', prop: 'Overlap', type: 'bool', value: false },
            { name: 'Invisible', prop: 'Invisible', type: 'bool', value: false },
            { name: 'Child', prop: 'Child', type: 'comp', value: [] },

        ]
    },
    {
        type: 'MChip',
        props: [
            { name: 'Value', prop: 'Value', type: 'text', value: '' },
            { name: 'Color', prop: 'Color', type: 'select,primary,secondary,default', value: 'default' },
            { name: 'Variant', prop: 'Variant', type: 'select,default,outlined', value: 'default' },
            { name: 'Size', prop: 'Size', type: 'select,medium,small', value: 'medium' },
            { name: 'Child', prop: 'Child', type: 'comp', value: [] },
        ]
    },
    {
        type: 'MTooltip',
        props: [
            { name: 'Value', prop: 'Value', type: 'text', value: '' },
            {
                name: 'Placement', prop: 'Placement', type: 'select,top-start,top,top-end,bottom-start,bottom,bottom-end,' +
                    'left-start,left,left-end,right-start,right,right-end'
            },
            { name: 'Arrow', prop: 'Arrow', type: 'bool', value: false },
            { name: 'Open', prop: 'Open', type: 'bool', value: false },
            { name: 'Interactive', prop: 'Interactive', type: 'bool', value: false },
            { name: 'LeaveDealy', prop: 'LeaveDelay', type: 'number', value: 3000 },
            { name: 'Child', prop: 'Child', type: 'comp', value: [] },
        ]

    },
    {
        type: 'MTypography',
        props: [
            { name: 'Value', prop: 'Value', type: 'text', value: '' },
            {
                name: 'Variant', prop: 'Variant', type: 'select,h1,h2,h3,h4,h5,h6,subtitle1,' +
                    'subtitle2,body1,body2,caption,button,overline,srOnly,inherit', value: ''
            },
            { name: 'Align', prop: 'Align', type: 'select,inherit,left,center,right,justify', value: '' },
            { name: 'Color', prop: 'Color', type: 'select,initial,inherit,primary,secondary,textprimary,textSecondary,error' },
            { name: 'Display', prop: 'Display', type: 'select,initial,block,inline', value: '' },
            { name: 'NoWrap', prop: 'NoWrap', type: 'bool', value: false },
            { name: 'GutterBottom', prop: 'GutterBottom', type: 'bool', value: false },
        ]
    },
    {
        type: 'MCProgress',
        props: [
            { name: 'Variant', prop: 'Variant', type: 'select,determinate,indeterminate', value: '' },
            { name: 'Color', prop: 'Color', type: 'select,primary,secondary,default', value: 'default' },
            { name: 'Value', prop: 'Value', type: 'number', value: 0 },

        ]
    },
    {
        type: 'MLProgress',
        props: [
            { name: 'Variant', prop: 'Variant', type: 'select,determinate,indeterminate,buffer', value: '' },
            { name: 'Color', prop: 'Color', type: 'select,primary,secondary,default', value: 'default' },
            { name: 'Value', prop: 'Value', type: 'number', value: 0 },
            { name: 'ValueBuffer', prop: 'ValueBuffer', type: 'number', value: 0 },

        ]
    },
    {
        type: 'MDialog',
        props: [
            { name: 'Open', prop: 'Open', type: 'bool', value: false },
            { name: 'MaxWidth', prop: 'MaxWidth', type: 'number', value: 0 },
            { name: 'FullScreen', prop: 'FullScreen', type: 'bool', value: false },
            { name: 'Child', prop: 'Child', type: 'comp', value: [] },
        ]
    },
    {
        type: 'MSnackbar',
        props: [
            { name: 'Open', prop: 'Open', type: 'bool', value: false },
            { name: 'Message', prop: 'Message', type: 'text', value: '' },
            { name: 'Vertical', prop: 'Vertical', type: 'select,top,bottom', value: 'bottom' },
            { name: 'Horizontal', prop: 'Horizontal', type: 'select,left,center,right', value: 'left' },
            { name: 'Child', prop: 'Child', type: 'comp', value: [] },

        ]
    },
    {
        type: 'MPaper',
        props: [
            { name: 'Elavation', prop: 'Elavation', type: 'number', value: 0 },
            { name: 'Square', prop: 'Square', type: 'bool', value: false },
            { name: 'Variant', prop: 'Variant', type: 'select,default,outline', value: 'default' },
            { name: 'Child', prop: 'Child', type: 'comp', value: [] },

        ]
    },
    {
        type: 'MCard',
        props: [
            { name: 'Variant', prop: 'Variant', type: 'select,default,outlined', value: 'default' },
            { name: 'Child', prop: 'Child', type: 'comp', value: [] },
        ]
    },
    {
        type: 'MSwitch',
        props: [
            { name: 'Value', prop: 'Value', type: 'bool', value: false },
            { name: 'Color', prop: 'Color', type: 'select,primary,secondary,default', value: 'standard' },
            { name: 'Name', prop: 'Name', type: 'text', value: '' },
            { name: 'Size', prop: 'Size', type: 'select,small,medium', value: 'normal' },
        ]
    },
    {
        type: 'MSlider',
        props: [
            { name: 'Value', prop: 'Value', type: 'number', value: 0 },
            { name: 'Marks', prop: 'Marks', type: 'bool', value: false },
            { name: 'Step', prop: 'Step', type: 'number', value: 0 },
            { name: 'DefaultValue', prop: 'DefaultValue', type: 'number', value: 0 },
            { name: 'Orientation', prop: 'Orientation', type: 'select,horizontal,vertical', value: 'horizontal' },
            { name: 'Max', prop: 'Max', type: 'number', value: 0 },
            { name: 'Min', prop: 'Min', type: 'number', value: 0 },
            { name: 'labelOn', prop: 'LabelOn', type: 'select,on,auto,off', value: false },

        ]
    },
    {
        type: 'MFab',
        props: [
            { name: 'Color', prop: 'Color', type: 'select,primary,default,secondary', value: 'default' },
            { name: 'Size', prop: 'Size', type: 'select,small,medium,large', value: 'large' },
            { name: 'Variant', prop: 'Variant', type: 'select,extended,round', value: 'default' },
            { name: 'Disabled', prop: 'Disabled', type: 'bool', value: false },
            { name: 'Child', prop: 'Child', type: 'comp', value: [] },
        ]
    },
    {
        type: 'MCheckbox',
        props: [
            { name: 'Value', prop: 'Value', type: 'bool', value: false },
            { name: 'DefaultChecked', prop: 'DefaultChecked', type: 'bool', value: false },
            { name: 'Color', prop: 'Color', type: 'select,primary,secondary,default', value: 'default' },
            { name: 'Indeterminate', prop: 'Indeterminate', type: 'bool', value: false },
            { name: 'Size', prop: 'Size', type: 'selct,small,medium,large', value: 'medium' },

        ]
    },
    {
        type: 'MRadio',
        props: [
            { name: 'Value', prop: 'Value', type: 'bool', value: false },
            { name: 'DefaultChecked', prop: 'DefaultChecked', type: 'bool', value: false },
            { name: 'Color', prop: 'Color', type: 'select,primary,secondary,default', value: 'default' },
            { name: 'Indeterminate', prop: 'Indeterminate', type: 'bool', value: false },
            { name: 'Size', prop: 'Size', type: 'selct,small,medium,large', value: 'medium' },

        ]
    },
    {
        type: 'MFormCL',
        props: [
            { name: 'Label', prop: 'Label', type: 'text', value: '' },
            { name: 'Placement', prop: 'Placement', type: 'select,top,start,bottom,end', value: 'start' },
            { name: 'Child', prop: 'Child', type: 'comp', value: [] },
        ]
    },
    {
        type: 'MLink',
        props: [
            { name: 'Href', prop: 'Href', type: 'text', value: '' },
            { name: 'Color', prop: 'Color', type: 'select,initial,inherit,primary,secondary,textPrimary,textSecondary,error' },
            { name: 'variant', prop: 'Variant', type: 'select,h3,h5,body1,body2,button', value: '' },
            { name: 'Underline', prop: 'Underline', type: 'select,none,hover,always', value: '' },
            { name: 'Child', prop: 'Child', type: 'comp', value: [] },
        ]
    },
    {
        type: 'MSelect',
        props: [
            { name: 'Values', prop: 'Values', type: 'text', value: '' },
            { name: 'Value', prop: 'Value', type: 'text', value: '' },

        ]
    }
]
//exports.propT = propT
//#region
const eventT = [
    { name: 'Button', events: [{ name: 'onClick', args: 'e' }, { name: 'onDbCLick', args: 'e' }] },
    { name: 'View', events: [{ name: 'onClick', args: 'e' }, { name: 'onDbCLick', args: 'e' }] },
    { name: 'TextInput', events: [{ name: 'onChange', args: 'e', }, { name: 'onClick', args: 'e', }] },
    { name: 'Icon', events: [{ name: 'onClick', args: 'e' }] },
    { name: 'Ripples', events: [{ name: 'onClick', args: 'e' }] },
    { name: 'TextInput', events: [{ name: 'onChange', args: 'e' }, { name: 'value', args: '' }] },
    { name: 'Html', events: [{ name: 'onClick', args: 'e' }] },
    { name: 'MButton', events: [{ name: 'onClick', args: 'e' }] },
    { name: 'MTextField', events: [{ name: 'onChange', args: 'e' }] },
    { name: 'MChip', events: [{ name: 'onClick', args: 'e', }, { name: 'onDelete', args: 'e' },] },
    { name: 'MTooltip', events: [{ name: 'onOpen', args: '' }, { name: 'onClose', args: '' }] },
    { name: 'MDialog', events: [{ name: 'onClose', args: '' }] },
    { name: 'MSnackbar', events: [{ name: 'onClose', args: '' }] },
    { name: 'MSwitch', events: [{ name: 'onChange', args: '' }] },
    { name: 'MSlider', events: [{ name: 'onChange', args: '' }] },
    { name: 'MFab', events: [{ name: 'onClick', args: 'e' }] },
    { name: 'MCheckbox', events: [{ name: 'onChange', args: 'e' }] },
    { name: 'MRadio', events: [{ name: 'onChange', args: 'e' }] },
    { name: 'MAvatar', events: [{ name: 'onClick', args: 'e' }] },
    { name: 'MSelect', events: [{ name: 'onChange', args: 'val' }] }
]

const getCodeClass = (code, prev = false, inst = {}) => {
    let tree = []
    if (inst.props && inst.props.tree) {
        tree = inst.props.tree
    }
    const mergeState = (...args) => {
        try {
            let tmpState = { ...inst.state }
            args.forEach((a, i) => {
                if (((i === 0) || (i % 2 === 0)) && (args[i + 1] !== undefined)) {
                    tmpState[a] = args[i + 1]
                }
            })
            inst.setState(tmpState)
        } catch (e) {
            console.log('ms error', e)
        }
    }

    const tiePS = (id, prop, value, defValue, warn = true) => {
        let locTree = []
        if (inst.props && inst.props.tree) {
            locTree = inst.props.tree
        }
        const ids = locTree.map(val => val.id)
        const pos = ids.indexOf(id)
        if (pos === -1) return null
        let props = locTree[pos].props
        if (ids.includes(id)) {
            let type = locTree[ids.indexOf(id)].name
            let pts = propT.map(t => t.type)
            let pos = pts.indexOf(type)
            if (pos !== -1) {
                let props = propT[pos].props
                let pnames = props.map(p => p.name)
                let ppos = pnames.indexOf(prop)
                if (ppos !== -1) {
                    prop = props[ppos].prop
                }
            }
        }
        let val = (value === undefined || value === null) ? defValue : value
        props[prop] = val
        return props

    }
    const getRef = (id, dontWrap = true) => {
        let ids = tree.map(c => c.id)
        let pos = ids.indexOf(id)
        if (pos === -1) return null
        let ref = inst.usedRefs[id]
        if (ref === undefined) return null
        return dontWrap ? ref.current : ref
    }
    const getFile = (name, meta = false) => {
        if (typeof name === 'string' && name.startsWith('res://')) {
            name = name.split('res://')[1]
        }
        if (!prev) {
            let fileNames = global.files.map(f => f.name)
            let filePos = fileNames.indexOf(name)
            if (filePos !== -1) {
                if (meta === true)
                    return global.files[filePos]
                else
                    return global.files[filePos].url
            }
        } else {
            let fnames = prev.files.map(f => f.name)
            let fpos = fnames.indexOf(name)
            if (fpos !== -1) {
                return prev.files[fpos].url
            }
        }
        return null
    }
    const toFile = (dataurl) => {
        try {
            let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([u8arr], { type: mime })
        } catch (e) {
            return null
        }
    }
    try {
        let body = `
            ${code}
            return main
        `
        //eslint-disable-next-line
        let c = Function(body)()
        let instance = new c({
            getState: () => inst.state, tiePS, getRef, toFile, mergeState,
            getFile, reactClass: inst, setState: (s) => inst.setState(s),
            getProps: () => inst.props.tree[0].props,
            getEvents: () => inst.events,
            getExtras: () => inst.parentData,
            getp: () => inst.props.tree[0].props,
        })
        if (typeof instance === 'object') {
            let keys = Object.getOwnPropertyNames(instance).concat(Object.getOwnPropertyNames(instance.__proto__))
            let methods = []
            let props = []
            keys.forEach(k => {
                if (typeof instance[k] === 'function') {
                    methods.push(k)
                } else {
                    props.push(k)
                }
            })
            methods = methods.reverse()
            return { instance, keys, methods, props }
        }
    } catch (e) {
        if (tree[0]) {
            console.warn(`Code error ${tree[0].name} ${e.message}`)
        }
    }
    return { instance: {}, keys: [], methods: [], props: [] }
}

export { propT, eventT, getCodeClass }

