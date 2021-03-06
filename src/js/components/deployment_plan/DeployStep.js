import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import DeploymentSuccess from './DeploymentSuccess';
import DeploymentFailure from './DeploymentFailure';
import DeploymentProgress from './DeploymentProgress';
import Link from '../ui/Link';
import Loader from '../ui/Loader';
import { stackStates } from '../../constants/StacksConstants';

const messages = defineMessages({
  validateAndDeploy: {
    id: 'DeployStep.validateAndDeploy',
    defaultMessage: 'Validate and Deploy'
  },
  requestingDeploy: {
    id: 'DeployStep.requestingDeploy',
    defaultMessage: 'Requesting a deploy...'
  }
});

const DeployStep = ({ currentPlan, currentStack, currentStackResources, currentStackResourcesLoaded,
                      currentStackDeploymentProgress, deleteStack, deployPlan, fetchStackResource,
                      fetchStackEnvironment, intl, isRequestingStackDelete, stacksLoaded }) => {

  if (!currentStack || currentStack.stack_status === stackStates.DELETE_COMPLETE) {
    return (
      <Loader loaded={stacksLoaded}>
        <Link className="link btn btn-primary btn-lg"
              disabled={currentPlan.isRequestingPlanDeploy}
              to="/deployment-plan/deployment-detail">
          <Loader loaded={!currentPlan.isRequestingPlanDeploy}
                  content={intl.formatMessage(messages.requestingDeploy)}
                  component="span"
                  inline>
            <span className="fa fa-cloud-upload"/> <FormattedMessage
                                                     {...messages.validateAndDeploy}/>
          </Loader>
        </Link>
      </Loader>
    );
  } else if (currentStack.stack_status.match(/PROGRESS/)) {
    return (
      <DeploymentProgress stack={currentStack}
                          isRequestingStackDelete={isRequestingStackDelete}
                          deleteStack={deleteStack}
                          deploymentProgress={currentStackDeploymentProgress}/>
    );
  } else if (currentStack.stack_status.match(/COMPLETE/)) {
    return (
      <DeploymentSuccess stack={currentStack}
                         stackResources={currentStackResources}
                         stackResourcesLoaded={currentStackResourcesLoaded}
                         isRequestingStackDelete={isRequestingStackDelete}
                         deleteStack={deleteStack}
                         fetchStackResource={fetchStackResource}
                         fetchStackEnvironment={fetchStackEnvironment} />
    );
  } else {
    return (
      <DeploymentFailure deleteStack={deleteStack}
                         isRequestingStackDelete={isRequestingStackDelete}
                         stack={currentStack}/>
    );
  }
};

DeployStep.propTypes = {
  currentPlan: ImmutablePropTypes.record.isRequired,
  currentStack: ImmutablePropTypes.record,
  currentStackDeploymentProgress: React.PropTypes.number.isRequired,
  currentStackResources: ImmutablePropTypes.map,
  currentStackResourcesLoaded: React.PropTypes.bool.isRequired,
  deleteStack: React.PropTypes.func.isRequired,
  deployPlan: React.PropTypes.func.isRequired,
  fetchStackEnvironment: React.PropTypes.func.isRequired,
  fetchStackResource: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object,
  isRequestingStackDelete: React.PropTypes.bool.isRequired,
  stacksLoaded: React.PropTypes.bool.isRequired
};

export default injectIntl(DeployStep);
