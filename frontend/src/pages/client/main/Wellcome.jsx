import { Box } from '@mui/material'
import Logo from '../components/Logo';
import * as React from 'react';
import Accordion, { accordionClasses } from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails, {
  accordionDetailsClasses,
} from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';

export default function Wellcome() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <div>
      <Box sx={{ mb: 10 }}>
        <Logo size={60} font='h4' />
      </Box>
      <Accordion
        expanded={expanded}
        onChange={handleExpansion}
        slots={{ transition: Fade }}
        slotProps={{ transition: { timeout: 400 } }}
        sx={
          [
            expanded
              ? {
                [`& .${accordionClasses.region}`]: {
                  height: 'auto',
                },
                [`& .${accordionDetailsClasses.root}`]: {
                  display: 'block',
                },
              }
              : {
                [`& .${accordionClasses.region}`]: {
                  height: 0,
                },
                [`& .${accordionDetailsClasses.root}`]: {
                  display: 'none',
                },
              }, {
              backgroundColor: "#ffffff00"
            }
          ]}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">نما چیست؟</Typography>
        </AccordionSummary>
        <AccordionDetails >
          <Typography sx={{ textAlign: "right" }}>
            نما امکانی برای شما فراهم میکند که می‌توانید به واسطه آن، راه‌های ارتباطی به مقصد شبکه‌های اجتماعی خود، کسب و کارتان و یا صفحاتی در وب را در قالب یک لینک و صفحه‌ای شکیل به مخاطبین خود ارائه کنید.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ backgroundColor: '#ffffff00' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">
            کاملا رایگان؟!
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ textAlign: "right" }}>
            پس از ساخت صفحه شخصی خود می‌توانید از تمام امکانات این پلتفرم به صورت کاملا رایگان و بدون محدودیت استفاده نمایید.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
