import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'axios';

import './Procedures.css';
import config from '../../config.js';

import FhirTransform from '../../FhirTransform.js';
import { renderDisplay } from '../../fhirUtil.js';
import { stringCompare } from '../../util.js';

//
// Display the 'Procedures' category if there are matching resources
//
export default class Procedures extends Component {

   static propTypes = {
      data: PropTypes.array.isRequired
   }

   state = {
      matchingData: null,
      loadingRefs: 0
   }

   setMatchingData() {
      let match = FhirTransform.getPathItem(this.props.data, '[*category=Procedures]');
      if (match.length > 0) {
	 this.setState({ matchingData: match.sort((a, b) => stringCompare(a.data.code.coding[0].display, b.data.code.coding[0].display)) });
	 for (var elt of match) {
	    this.resolveReasonReference(elt);
	 }
      } else {
	 this.setState({ matchingData: null });
      }
   }

   componentDidMount() {
      this.setMatchingData();
   }

   componentDidUpdate(prevProps, prevState) {
      if (prevProps.data !== this.props.data) {
	 this.setMatchingData();
      }
   }

   // TODO: Handle multiple reason references per single procedure
   resolveReasonReference(elt) {
      if (elt.data.reasonReference && elt.data.reasonReference[0] && !elt.data.reasonReference[0].code) {
	 this.setState({loadingRefs: this.state.loadingRefs+1});
	 get(config.serverUrl + '/reference/' + encodeURIComponent(elt.provider) + '/' + encodeURIComponent(elt.data.reasonReference[0].reference))
	    .then(response => {
		// Add the de-referenced data to the reasonReference element
		elt.data.reasonReference[0] = Object.assign(elt.data.reasonReference[0], response.data);
		this.setState({loadingRefs: this.state.loadingRefs-1});
	    })
	    .catch(fetchError => {
		console.log(fetchError);
		this.setState({loadingRefs: this.state.loadingRefs-1});
	    });
      }
   }

   render() {
      return ( this.state.matchingData &&
	       <div className={this.props.className}>
	          <div className={this.props.className+'-header'}>Procedures</div>
	          <div className={this.props.className+'-body'}>
		     { renderDisplay(this.state.matchingData, this.props.className) }
		     { this.state.loadingRefs > 0 && <div className={this.props.className+'-loading'}>Loading ...</div> }
	          </div>
	       </div> );
   }
}
