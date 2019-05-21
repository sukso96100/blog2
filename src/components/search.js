import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import ListItemText from "@material-ui/core/ListItemText"
import ListItem from "@material-ui/core/ListItem"
import List from "@material-ui/core/List"
import Divider from "@material-ui/core/Divider"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import CloseIcon from "@material-ui/icons/Close"
import SearchIcon from "@material-ui/icons/Search"
import Slide from "@material-ui/core/Slide"
import InputBase from "@material-ui/core/InputBase"

import { StaticQuery, Link } from "gatsby"
import { graphql } from "gatsby"

import { Index } from "elasticlunr"

const styles = {
  appBar: {
    position: "relative",
  },
  flex: {
    flex: 1,
  },
}

function Transition(props) {
  return <Slide direction="up" {...props} />
}

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: "",
      results: [],
      open: false,
    }
  }

  getOrCreateIndex = () => {
    return this.index ? this.index : Index.load(this.searchIndex)
  }

  search = evt => {
    const query = evt.target.value
    this.index = this.getOrCreateIndex()
    this.setState({
      query,
      results: this.index
        .search(query, {})
        .map(({ ref }) => this.index.documentStore.getDoc(ref)),
    })
  }
  render() {
    const { classes } = this.props
    return (
      <StaticQuery
        query={graphql`
          query SearchIndexQuery {
            siteSearchIndex {
              index
            }
          }
        `}
        render={data => {
          this.searchIndex = data.siteSearchIndex.index
          return (
            <Dialog
              fullScreen
              open={this.props.open}
              onClose={this.props.onClose}
              TransitionComponent={Transition}
            >
              <AppBar className={classes.appBar}>
                <Toolbar>
                  <IconButton
                    color="inherit"
                    onClick={this.props.handleClose}
                    aria-label="Close"
                  >
                    <CloseIcon />
                  </IconButton>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <InputBase
                      placeholder="Search…"
                      value={this.state.query}
                      onChange={this.search}
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                    />
                  </div>
                </Toolbar>
              </AppBar>
              <List>
                {this.state.results.map(page => (
                  <Link to={`/${page.path}`} key={page.id}>
                    <ListItem button>
                      <ListItemText
                        primary={page.title}
                        secondary={`#${page.tags.join(" #")}`}
                      />
                    </ListItem>
                  </Link>
                ))}

                <Divider />
                <ListItem button>
                  <ListItemText
                    primary="Default notification ringtone"
                    secondary="Tethys"
                  />
                </ListItem>
              </List>
            </Dialog>
          )
        }}
      />
    )
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Search)
