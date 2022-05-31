import React from 'react';
import { Modal, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { payment_details_modal } from '../../redux/actions/fetchActions';
const PaymentDetails = ({
  paymentDetailsModal,
  paymentDetailsId,
  payment_details_modal,
  paymentTransactionList,
}) => {
  return (
    <>
      <Modal
        show={paymentDetailsModal}
        onHide={() =>
          payment_details_modal({ show: false, id: paymentDetailsId })
        }
      >
        <Modal.Header closeButton>
          <Modal.Title>Payment Slip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            {paymentTransactionList.map((item) => {
              if (item.id === paymentDetailsId) {
                return (
                  <>
                    <tr>
                      <td>
                        <b>Id</b>
                      </td>
                      <td>{item.id}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>From Date</b>
                      </td>
                      <td>{item.from_date}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>To Date</b>
                      </td>
                      <td>{item.to_date}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Site</b>
                      </td>
                      <td>{item.site}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Paid On</b>
                      </td>
                      <td>
                        {item.paid_on
                          .slice(0, 10)
                          .split('-')
                          .reverse()
                          .join('-')}
                      </td>
                    </tr>
                  </>
                );
              }
              else{
                return null
              }
            })}
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => ({
  paymentDetailsId: state.paymentDetailsId,
  paymentDetailsModal: state.paymentDetailsModal,
  paymentTransactionList: state.paymentTransactionList,
});
export default connect(mapStateToProps, { payment_details_modal })(
  PaymentDetails
);
