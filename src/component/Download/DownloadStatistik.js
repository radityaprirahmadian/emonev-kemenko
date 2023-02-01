import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from '@david.kucsai/react-pdf-table';
import React from 'react';

const style = StyleSheet.create({
  body: {
    paddingTop: 60,
    paddingBottom: 80,
    paddingLeft: 60,
    paddingRight: 60,
    fontSize: 5,
    position: 'relative',
  },

  no: {
    width: 7,
    padding: 10,
    fontSize: 9,
  },

  withPadding: {
    padding: 7,
    fontSize: 9,
  },
});

const DownloadStatistik = (props) => {
  return (
    <Document size="A4">
      <Page style={style.body}>
        <Table data={props.data}>
          <TableHeader>
            <TableCell style={style.no} weighting={0.1}>
              No
            </TableCell>
            <TableCell style={style.withPadding} weighting={0.5}>
              Instansi
            </TableCell>
            <TableCell style={style.withPadding} weighting={0.7}>
              Judul Laporan
            </TableCell>
            <TableCell style={style.withPadding} weighting={0.6}>
              Gerakan
            </TableCell>
            <TableCell style={style.withPadding} weighting={0.5}>
              Periode Pelaporan
            </TableCell>
          </TableHeader>
          <TableBody>
            <DataTableCell style={style.no} weighting={0.1} getContent={(r) => r['No']} />
            <DataTableCell
              style={style.withPadding}
              weighting={0.5}
              getContent={(r) => r['Instansi']}
            />
            <DataTableCell
              style={style.withPadding}
              weighting={0.7}
              getContent={(r) => r['Judul Laporan']}
            />
            <DataTableCell
              style={style.withPadding}
              weighting={0.6}
              getContent={(r) => r['Gerakan']}
            />
            <DataTableCell
              style={style.withPadding}
              weighting={0.5}
              getContent={(r) => r['Periode Pelaporan']}
            />
          </TableBody>
        </Table>
      </Page>
    </Document>
  );
};

export default DownloadStatistik;
