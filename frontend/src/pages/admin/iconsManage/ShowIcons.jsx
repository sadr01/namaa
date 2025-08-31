
import { Box, IconButton, Typography } from '@mui/material';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Alt from '../components/Alt'

const IconGrid = ({ icons, func, columnWidth = 40, rowHeight = 40 }) => {
  return (

    <AutoSizer>
      {({ height, width }) => {
        const columnCount = Math.floor(width / columnWidth);
        const rowCount = Math.ceil(icons.length / columnCount);

        return (
          <Grid
            columnCount={columnCount}
            columnWidth={columnWidth}
            height={height}
            rowCount={rowCount}
            rowHeight={rowHeight}
            width={width}
          >
            {({ columnIndex, rowIndex, style }) => {
              const index = rowIndex * columnCount + columnIndex;
              if (index >= icons.length) return null;

              const { title, icon } = icons[index];
              return (
                <div style={style}>
                  <IconButton onClick={() => func(title)}>
                    <Alt text={title}>{icon}</Alt>
                  </IconButton>
                </div>
              );
            }}
          </Grid>
        );
      }}
    </AutoSizer>

  );
};

export default IconGrid;
