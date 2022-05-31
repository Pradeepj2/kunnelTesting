import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import './Finance.css';
const TallyData = ({ tallyData }) => {
  return (
    <>
      <Table bordered striped responsive>
        <thead>
          <th>Sl.No.</th>
          <th>Title</th>
          <th>Site</th>
          <th>Date</th>
          <th>Total Amount</th>
          <th>No.of Transactions</th>
          <th style={{ width: '500px' }}>Sub Transactions</th>
        </thead>

        <tbody>
          {tallyData.map((data) => {
            const { main_transaction, sub_transactions } = data;
            return (
              <tr>
                <td>{tallyData.indexOf(data) + 1}</td>
                <td>{main_transaction.title}</td>
                <td>{main_transaction.site}</td>
                <td>{main_transaction.date}</td>
                <td>{main_transaction.total_amount}</td>
                <td>{main_transaction.no_of_transactions}</td>
                <td style={{ padding: '0px' }}>
                  <tr className="subTransactionRow">
                    <td>Sl.No.</td>
                    <td>Title</td>
                    <td>Debit Account</td>
                    <td>Credit Account</td>
                    <td>Amount</td>
                  </tr>
                  {sub_transactions.map((transaction) => {
                    return (
                      <tr className="subTransactionRow">
                        <td style={{ width: '50px' }}>
                          {sub_transactions.indexOf(transaction) + 1}
                        </td>
                        <td style={{ width: '300px' }}>{transaction.title}</td>
                        <td style={{ width: '50px' }}>
                          {transaction.dr_account}
                        </td>
                        <td style={{ width: '50px' }}>
                          {transaction.cr_account}
                        </td>
                        <td style={{ width: '50px' }}>{transaction.amount}</td>
                      </tr>
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
const mapStateToProps = (state) => ({
  tallyData: state.tallyData,
});
export default connect(mapStateToProps)(TallyData);
