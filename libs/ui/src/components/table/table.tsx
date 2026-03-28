import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableFooter,
  StyledTableHead,
  StyledTableHeader,
  StyledTableRow
} from './table.styled';

const Root = StyledTable;
const Header = StyledTableHeader;
const Body = StyledTableBody;
const Footer = StyledTableFooter;
const Head = StyledTableHead;
const Row = StyledTableRow;
const Cell = StyledTableCell;

Root.displayName = 'Table';
Header.displayName = 'TableHeader';
Body.displayName = 'TableBody';
Footer.displayName = 'TableFooter';
Head.displayName = 'TableHead';
Row.displayName = 'TableRow';
Cell.displayName = 'TableCell';

export const Table = Object.assign(Root, {
  Header,
  Body,
  Footer,
  Head,
  Row,
  Cell
});
