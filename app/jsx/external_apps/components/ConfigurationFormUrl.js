/*
 * Copyright (C) 2014 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import $ from 'jquery'
import I18n from 'i18n!external_tools'
import React from 'react'
import PropTypes from 'prop-types'
import TextInput from '../../external_apps/components/TextInput'
import CheckboxInput from '../../external_apps/components/CheckboxInput'
import 'compiled/jquery.rails_flash_notifications'

export default class ConfigurationFormUrl extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    consumerKey: PropTypes.string,
    sharedSecret: PropTypes.string,
    configUrl: PropTypes.string,
    allowMembershipServiceAccess: PropTypes.bool,
    membershipServiceFeatureFlagEnabled: PropTypes.bool
  }

  state = {
    errors: {}
  }

  isValid = () => {
    let fields = ['name', 'configUrl'],
      errors = {},
      formErrors = []

    fields.forEach(field => {
      const value = this.refs[field].state.value
      if (!value) {
        errors[field] = I18n.t('This field is required')
        formErrors.push(I18n.t('This field "%{name}" is required.', {name: field}))
      }
    })
    this.setState({errors})

    let isValid = true
    if (Object.keys(errors).length > 0) {
      isValid = false
      $.screenReaderFlashError(
        I18n.t('There were errors with the form: %{errors}', {errors: formErrors.join(' ')})
      )
    }
    return isValid
  }

  getFormData = () => {
    const data = {
      name: this.refs.name.state.value,
      consumerKey: this.refs.consumerKey.state.value,
      sharedSecret: this.refs.sharedSecret.state.value,
      configUrl: this.refs.configUrl.state.value,
      verifyUniqueness: 'true'
    }

    if (this.props.membershipServiceFeatureFlagEnabled) {
      data.allow_membership_service_access = this.refs.allow_membership_service_access.state.value
    }

    return data
  }

  renderMembershipServiceOption = () => {
    if (this.props.membershipServiceFeatureFlagEnabled) {
      return (
        <CheckboxInput
          id="allow_membership_service_access"
          ref="allow_membership_service_access"
          label={I18n.t('Allow this tool to access the IMS Names and Role Provisioning Service')}
          checked={this.props.allowMembershipServiceAccess}
          errors={this.state.errors}
        />
      )
    }
  }

  render() {
    return (
      <div className="ConfigurationFormUrl">
        <TextInput
          ref="name"
          id="name"
          defaultValue={this.props.name}
          label={I18n.t('Name')}
          required
          errors={this.state.errors}
        />
        <div className="grid-row">
          <div className="col-xs-6">
            <TextInput
              ref="consumerKey"
              id="consumerKey"
              defaultValue={this.props.consumerKey}
              label={I18n.t('Consumer Key')}
              errors={this.state.errors}
            />
          </div>
          <div className="col-xs-6">
            <TextInput
              ref="sharedSecret"
              id="sharedSecret"
              defaultValue={this.props.sharedSecret}
              label={I18n.t('Shared Secret')}
              errors={this.state.errors}
            />
          </div>
        </div>

        {this.renderMembershipServiceOption()}

        <TextInput
          ref="configUrl"
          id="configUrl"
          defaultValue={this.props.configUrl}
          label={I18n.t('Config URL')}
          hintText={I18n.t('Example: https://example.com/config.xml')}
          required
          errors={this.state.errors}
        />
      </div>
    )
  }
}
