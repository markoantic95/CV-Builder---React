import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ButtonBases from "./ButtonBases";
// import Feed from "./FeedItem";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

function FullWidthGrid(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation='10'><ButtonBases></ButtonBases></Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper} style={{textAlign:'justify'}} elevation='10' >
            <h1>How to Write a Perfect CV</h1>
            <p>&#9658; Identify the right personal details to include. Learn what to add and what to leave out, such as whether to include your marital status or nickname.</p>
            <p>&#9658; Add a personal statement. Find out what one is and how it can be used to focus a potential employer’s attention on your best attributes.</p>
            <p>&#9658; Know what to include in the skill section. Discover how to bring your skills to the fore and make sure you understand the difference between transferable, job-related and adaptive skills.</p>
            <p>&#9658; Mention former jobs. Brush up on the best ways to present former or current employment in a way that shows you in the best light.</p>
            <p>&#9658; Don’t forget your qualifications. Learn what to include, how to select relevant qualifications for a particular CV and why not listing everything exhaustively is crucial.</p>
            <p>&#9658; Tailor it to the application. Gain skills with writing a CV that is adapted to an individual employer or a particular sector of industry to get the best results.</p>
            <p>&#9658; Keep it up to date. Find out the best ways of keeping your CV up to date so that it is ready to go at a moment’s notice.</p>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper} style={{textAlign:'justify'}} elevation='10'>
          <h1>How to Choose the Best Format</h1>
            <p>Don't forget about the importance of a good CV format to give structure to all the crucial information you need to include to complete your efficient job application.</p>
            <p>Writing a CV can seem difficult, but once you start it gets a lot easier. The challenging part is deciding which format to use. While this is something that you get to learn with experience and – lots of research into what employers look for there are generally some rules that apply regarding the use of each type.</p>
            <p> The following three questions can help you make the right choice:</p>
            <p>&#9658; Why do you need it?</p>
            <p>&#9658; What are you hoping to get out of it?</p>
            <p>&#9658; What do you want it to tell employers?</p>
            <p>For example, are you after a career change, applying for a job for the first time, are you hoping to advance in your career, get a raise or apply for a management role?</p>
            <p>If you are just starting out, your CV should be relatively straightforward, but for mid-career or late-career professionals it can get a bit more complex.</p>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper className={classes.paper}></Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper className={classes.paper}></Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper className={classes.paper}></Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper className={classes.paper}></Paper>
        </Grid>
      </Grid>
    </div>
  );
}

FullWidthGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);