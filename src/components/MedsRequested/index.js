import React from 'react';
import PropTypes from 'prop-types';
// import axios from 'axios';

import '../ContentPanel/ContentPanel.css';
// import config from '../../config.js';

import FhirTransform from '../../FhirTransform.js';
import {
  renderMeds, resolveReasonReference, resolveMedicationReference, primaryTextValue,
} from '../../fhirUtil.js';
import {
  Const, stringCompare, shallowEqArray, formatKey, formatContentHeader, tryWithDefault,
} from '../../util.js';

//
// Display the 'Meds Requested' category if there are matching resources
//
export default class MedsRequested extends React.Component {
  static catName = 'Meds Requested';

  static compareFn(a, b) {
    return stringCompare(MedsRequested.primaryText(a), MedsRequested.primaryText(b));
  }

  static code(elt) {
    //      return elt.data.medicationCodeableConcept ? elt.data.medicationCodeableConcept : null;  // RxNorm
    return tryWithDefault(elt, (elt) => elt.data.medicationCodeableConcept, null); // RxNorm
  }

  static primaryText(elt) {
    //      return elt.data.medicationCodeableConcept ? elt.data.medicationCodeableConcept.coding[0].display : '';
    //      return tryWithDefault(elt, elt => MedsRequested.code(elt).coding[0].display, Const.unknownValue);
    return primaryTextValue(MedsRequested.code(elt));
  }

  static propTypes = {
    data: PropTypes.array.isRequired,
    isEnabled: PropTypes.bool,
    showDate: PropTypes.bool,
  }

  state = {
    matchingData: null,
    loadingRefs: 0,
  }

  //   AxiosCancelSource = axios.CancelToken.source();

  tweakMedsRequested(elt) {
    if (elt.data.medicationReference.display) {
      // Mark medicationReference and create minimal medicationCodeableConcept element
      elt.data.medicationReference = Object.assign(elt.data.medicationReference, { code: Const.unknownValue });
      elt.data.medicationCodeableConcept = { coding: [{ code: Const.unknownValue, display: elt.data.medicationReference.display }] };
      return true;
    }
    return false;
  }

  setMatchingData() {
    const match = FhirTransform.getPathItem(this.props.data, `[*category=${MedsRequested.catName}]`);
    const withCode = [];

    if (match.length > 0) {
      for (const elt of match) {
        if (elt.data.medicationCodeableConcept || this.tweakMedsRequested(elt)) {
          withCode.push(elt);
        } else if (resolveMedicationReference(elt, this.props.legacyResources)) {
          this.setState((prevState) => ({
            matchingData: prevState.matchingData ? prevState.matchingData.concat([elt]).sort(this.sortMeds) : [elt],
          }));
        }
        resolveReasonReference(elt, this.props.legacyResources);
      }
    }

    this.setState({ matchingData: withCode.length > 0 ? withCode.sort(MedsRequested.compareFn) : null });
  }

  componentDidMount() {
    this.setMatchingData();
  }

  componentDidUpdate(prevProps, _prevState) {
    if (!shallowEqArray(prevProps.data, this.props.data)) {
      this.setMatchingData();
    }
  }

  //   componentWillUnmount() {
  //      // Cancel any pending async gets
  //      this.AxiosCancelSource.cancel('unmounting');
  //   }

  // OLDresolveMedicationReference(elt) {
  //    if (elt.data.medicationReference && !elt.data.medicationReference.code) {
  //    this.setState({loadingRefs: this.state.loadingRefs+1});
  //    axios.get(config.serverUrl + '/reference/' + encodeURIComponent(elt.provider) + '/' + encodeURIComponent(elt.data.medicationReference.reference),
  //        { cancelToken: this.AxiosCancelSource.token } )
  //       .then(response => {
  //     // Add the de-referenced data to the medicationReference element AND create the medicationCodeableConcept element
  //     elt.data.medicationReference = Object.assign(elt.data.medicationReference, response.data);
  //     elt.data.medicationCodeableConcept = response.data.code;
  //     this.setState({ loadingRefs: this.state.loadingRefs-1,
  //               matchingData: this.state.matchingData ? this.state.matchingData.concat([elt]).sort(this.sortMeds)
  //                       : [ elt ] });
  //       })
  //       .catch(thrown => {
  //     if (!axios.isCancel(thrown)) {
  //        console.log(thrown);
  //        this.setState({loadingRefs: this.state.loadingRefs-1});
  //     }
  //       });
  //    } else {
  //    console.log('Missing medicationReference!');
  //    }
  // }

  // Fix inconsistencies between our category names and FHIR names
  patchCatName(catName) {
    switch (catName) {
      case 'Condition':
        return 'Conditions';
      default:
        return catName;
    }
  }

  // TODO: Handle multiple reason references per single medication request
  //       Move to fhirUtil.js (with callback for state management)
  // OLDresolveReasonReference(elt) {
  //    if (elt.data.reasonReference && elt.data.reasonReference[0] && !elt.data.reasonReference[0].code) {
  //    this.setState({loadingRefs: this.state.loadingRefs+1});
  //    axios.get(config.serverUrl + '/reference/' + encodeURIComponent(elt.provider) + '/' + encodeURIComponent(elt.data.reasonReference[0].reference),
  //        { cancelToken: this.AxiosCancelSource.token } )
  //       .then(response => {
  //     // Add the de-referenced data to the reasonReference element
  //     elt.data.reasonReference[0] = Object.assign(elt.data.reasonReference[0], response.data);
  //     this.setState({loadingRefs: this.state.loadingRefs-1});
  //       })
  //       .catch(thrown => {
  //     if (!axios.isCancel(thrown)) {
  //        console.log(thrown);
  //        this.setState({loadingRefs: this.state.loadingRefs-1});
  //     }
  //       });
  //    }
  // }

  render() {
    const firstRes = this.state.matchingData && this.state.matchingData[0];
    const {
      patient, providers, trimLevel,
    } = this.props;
    return (this.state.matchingData
      && (this.props.isEnabled || trimLevel === Const.trimNone) // Don't show this category (at all) if disabled and trim set
      && (
      <div className="meds-requested category-container" id={formatKey(firstRes)}>
        { formatContentHeader(this.props.isEnabled, MedsRequested.catName, firstRes, { patient, trimLevel }) }
        <div className="content-body">
          { this.props.isEnabled && renderMeds(this.state.matchingData, providers) }
          { this.props.isEnabled && this.state.loadingRefs > 0 && <div className="category-loading">Loading ...</div> }
        </div>
      </div>
      ));
  }
}
