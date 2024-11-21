import nodemailer from 'nodemailer';
import { getMockFor } from 'nodemailer-mock';

// Create a mocked version of nodemailer
const nodemailerMock = getMockFor(nodemailer);

export default nodemailerMock;
