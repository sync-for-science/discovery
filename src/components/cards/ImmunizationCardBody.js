import React from 'react';

import CardBodyField from './CardBodyField';
import CARD_BODY_LABEL from './cardBodyLabel';

const ImmunizationCardBody = ({ fieldsData }) => {
  const givenDisplay = fieldsData.notGiven ? 'no' : 'yes';
  const primarySourceDisplay = fieldsData.primarySource ? 'yes' : 'no';
  const reportedDisplay = fieldsData.reported ? 'yes' : 'no';
  return (
    <>
      <CardBodyField
        dependency={fieldsData.patientAgeAtRecord}
        label={CARD_BODY_LABEL.age}
        value={fieldsData.patientAgeAtRecord}
      />
      <CardBodyField
        dependency={fieldsData.vaccineDisplay}
        label={CARD_BODY_LABEL.vaccine}
        value={fieldsData.vaccineDisplay}
        bold
      />
      <CardBodyField
        dependency={fieldsData.notGiven !== undefined}
        label={CARD_BODY_LABEL.given}
        value={givenDisplay}
      />
      <CardBodyField
        dependency={fieldsData.reported}
        label={CARD_BODY_LABEL.reported}
        value={reportedDisplay}
      />
      <CardBodyField
        dependency={fieldsData.primarySource}
        label={CARD_BODY_LABEL.primarySource}
        value={primarySourceDisplay}
      />
      <CardBodyField
        dependency={fieldsData.provider}
        label={CARD_BODY_LABEL.provider}
        value={fieldsData.provider}
      />
      <CardBodyField
        dependency={fieldsData.status}
        label={CARD_BODY_LABEL.status}
        value={fieldsData.status}
      />
    </>
  );
};

export default ImmunizationCardBody;
