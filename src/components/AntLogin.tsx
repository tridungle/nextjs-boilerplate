import { Form, Icon, Input, Button } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { bindActionCreators, Dispatch } from 'redux';

import { authActions } from 'modules/auth/index';
import React from 'react';
import { FormComponentProps, FormProps } from 'antd/lib/form';
import { AppState } from '../store/reducers';

const FormItem = Form.Item;

function hasErrors(fieldsError: any) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

interface StateProps {
  isAuthenticating: AppState['auth']['isAuthenticating'];
  statusText: AppState['auth']['statusText'];
}

interface DispatchProps {
  loginUser: authActions.TLoginUser;
}

type Props = FormComponentProps & StateProps & DispatchProps;

class HorizontalLoginForm extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    const redirectRoute = '/login';
    this.state = {
      redirectTo: redirectRoute
    };
  }

  componentDidMount() {
    this.props.form.validateFields();
  }

  handleSubmit: FormProps['onSubmit'] = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.loginUser(
          values.userName,
          values.password,
        );
      }
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    // Only show error after a field is touched.
    const userNameError =
      isFieldTouched('userName') && getFieldError('userName');
    const passwordError =
      isFieldTouched('password') && getFieldError('password');
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem
          validateStatus={userNameError ? 'error' : 'validating'}
          help={userNameError || ''}
        >
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />
          )}
        </FormItem>
        <FormItem
          validateStatus={passwordError ? 'error' : 'validating'}
          help={passwordError || ''}
        >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Log in
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedHorizontalLoginForm = Form.create()(HorizontalLoginForm);

function mapStateToProps(state: AppState) {
  return {
    isAuthenticating: state.auth.isAuthenticating,
    statusText: state.auth.statusText
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(authActions, dispatch);
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(WrappedHorizontalLoginForm);
