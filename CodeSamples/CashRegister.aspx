<%@ Page Language="C#" AutoEventWireup="true" CodeFile="CashRegister.aspx.cs" Inherits="CashRegister" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Creative Cash Draw Solutions - Register</title>
    <style>
        h1 { text-align: center; }
        h3 { font-size: small; text-align: justify; }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <h1>Cash Register FUN</h1>
        <h3>This is a simple page that allows you to enter how much a customer owes, how much they paid, and it will tell you the simpliest amount of bills and coins to return. <b><i>UNLESS</i></b> the amount 
            owed is divisible by 3, in which case the bills and coins returned will be chosen at random (though still adding up to the correct amount).
        </h3>
        <table>
            <tr>
                <td>Owed:</td>
                <td><asp:TextBox ID="txtTotal" runat="server" placeholder="Total amount due" /></td>
            </tr>
            <tr>
                <td>Paid:</td>
                <td><asp:TextBox ID="txtPaid" runat="server" placeholder="Total amount paid" /></td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td><asp:Button ID="btnGetChange" runat="server" Text="Get change" OnClick="btnGetChange_Click" /></td>
            </tr>
        </table>
        <br /><br />
        <asp:Label ID="lblChange" runat="server" />
    </div>
    </form>
</body>
</html>
