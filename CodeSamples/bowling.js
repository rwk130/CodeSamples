var Frames;
var Total;
var FrameNum;

//Frame Constructor
function Frame() {
    var TopFrame = "";
    var BottomFrame = "";

    this.get_TopFrame = function () { return TopFrame; };
    this.set_TopFrame = function (value) {
        TopFrame = value;
    }

    this.get_BottomFrame = function () { return BottomFrame; };
    this.set_BottomFrame = function (value) {
        BottomFrame = value;
    }
}

Frame.prototype.MakeFrame = function () { };


function BeginGame() {
    Total = 0;
    Frames = [new Frame(), new Frame(), new Frame(), new Frame(), new Frame(), new Frame(), new Frame(), new Frame(), new Frame(), new Frame(), new Frame()];
    BuildTable();
    document.getElementById("Player1").innerHTML = "Player 1";
    document.getElementById("lblQuestion").innerHTML = "What is your name?";
    document.getElementById("lblDirections").innerHTML = "Letters and spaces only";
    setAttribute("lblQuestion", "class", "showButton");
    setAttribute("lblDirections", "class", "showButton");
    setAttribute("btnSubmit", "class", "showButton");
    setAttribute("txtName", "class", "showButton");
    setAttribute("btnGame", "class", "hideButton");
    document.getElementById("btnSubmit").textContent = "Submit";
    FrameNum = 1;
    document.getElementById("txtName").focus();
    document.getElementById("txtName").select();
}

function setAttribute(ElemnetID, AttributeID, NodeValue) {
    var Attr = document.getElementById(ElemnetID).attributes;
    var Node = document.createAttribute(AttributeID);
    Node.nodeValue = NodeValue;
    Attr.setNamedItem(Node);
}

function SetName() {
    var RegExpression = new RegExp(/^[a-zA-z\s]*$/);
    var Name=document.getElementById("txtName").value;
    if (RegExpression.exec(Name) == null) {
        document.getElementById("Player1").innerHTML = "Illegal entry<br />Try again.";
    }
    else {
        document.getElementById("Player1").innerHTML = Name;
        setAttribute("btnSubmit", "class", "hideButton");
        setAttribute("txtName", "class", "hideButton");
        setAttribute("txtFrame", "class", "showButton");
        document.getElementById("lblQuestion").innerHTML = "Frame 1 Roll 1:";
        document.getElementById("lblDirections").innerHTML = "Enter number of pins knocked down, x for strike, or / for spare";
        document.getElementById("txtFrame").focus();
        document.getElementById("txtFrame").select();
    }
}

function SetFrame() {
    var RegExpression = new RegExp(/^[0-9x\-\/]$/);
    var Entry = document.getElementById("txtFrame").value;
    if (Entry == "0") {
        Entry = "-";
    }
    var RollNum = document.getElementById("lblQuestion").innerHTML.toString().substr(document.getElementById("lblQuestion").innerHTML.toString().length - 2, 1);
    if (RegExpression.exec(Entry) != null) {
        var ThisFrame = Frames[FrameNum - 1];
        var Question = document.getElementById("lblQuestion").innerHTML;
        if (FrameNum == 11) {
            ThisFrame.set_TopFrame(Entry);
            EndGame();
        } else if (FrameNum == 10) {
            if (Question.indexOf("Roll 1") >= 0) {

                ThisFrame.set_TopFrame(Entry);
                RollNum = 2;
            } else {
                ThisFrame.set_BottomFrame(Entry);
                if (ThisFrame.get_TopFrame() == "x" || ThisFrame.get_BottomFrame() == "/" || (parseInt(ThisFrame.get_TopFrame()) +parseInt(ThisFrame.get_BottomFrame()) >= 10)) {
                    FrameNum++;
                    RollNum = 1;
                } else {
                    EndGame(); 
                }
            }
        } else if (Question.indexOf("Roll 1") >= 0) {
            if (Entry == "x") {
                ThisFrame.set_TopFrame(Entry);
                FrameNum++;
                RollNum = 1;
            } else if (Entry != "/") {
                ThisFrame.set_TopFrame(Entry);
                RollNum = 2;
            }
        } else {
            if (Entry != "x") {
                ThisFrame.set_BottomFrame(Entry);
                FrameNum++;
                RollNum = 1;
            }
        }
        document.getElementById("lblQuestion").innerHTML = "Frame " + FrameNum.toString() + " Roll " + RollNum.toString() + ":";
        BuildTable();
    }
    document.getElementById("txtFrame").value = "";

}

function BuildTable() {
    var Count = 0;
    Total = 0;
    for (var FrameNum = 1; FrameNum < 10; FrameNum++) {
        SetLabel("f" + FrameNum.toString() + "r1", Frames[Count].get_TopFrame());
        SetLabel("f" + FrameNum.toString() + "r2", Frames[Count].get_BottomFrame());
        SetLabel("f" + FrameNum.toString() + "Total", FrameTotal(Count));
        Count++;
    }
    SetLabel("f10r1", Frames[9].get_TopFrame());
    SetLabel("f10r2", Frames[9].get_BottomFrame());
    SetLabel("f11", Frames[10].get_TopFrame());
    SetLabel("f10Total", ScoreTenth());
    SetLabel("RunningTotal", Total.toString());
}

function FrameTotal(Number) {
    var ThisTotal = "";
    var ThisTop = Frames[Number].get_TopFrame();
    var ThisBottom = Frames[Number].get_BottomFrame();

    if (ThisTop == "") { return ""; } //frame not rolled yet
    else if (ThisTop == "-") { ThisTotal = 0; } //gutter ball
    else if (ThisTop == "x") { ThisTotal = CalculateStrike(Number); } //strike
    else { ThisTotal = parseInt(ThisTop); }

    if (ThisTop != "x") {
        if (ThisBottom == "") { return ""; } //frame not rolled yet
        else if (ThisBottom == "-") { ThisTotal += 0; } //gutter ball or strike, no bottom frame
        else if (ThisBottom == "/") { ThisTotal = CalculateSpare(Number); } //spare
        else {
            ThisTotal += parseInt(ThisBottom);
            if (ThisTotal > 10) {
                Frames[Number].set_BottomFrame("");
                FrameNum--;
                document.getElementById("lblQuestion").innerHTML = "Frame " + FrameNum.toString() + " Roll 2:";
                BuildTable();
                return "";
            } else if (ThisTotal == 10) {
                Frames[Number].set_BottomFrame("/");
                BuildTable();
                return "";
            }

        }
    }
    try {
        var Test = parseInt(ThisTotal);
        var Test2 = isNaN(Test);
        if (!isNaN(ThisTotal) && ThisTotal.toString() != "") {
            Total += Test;
            return Total;
        } else {
            return "";
        }
    } catch (Exception) {
        return "";
    }
}

function ScoreTenth() {
    var ThisTotal = 0;
    var Roll1 = Frames[9].get_TopFrame();
    var Roll2 = Frames[9].get_BottomFrame();
    var Roll3 = Frames[10].get_TopFrame();

    if (Roll1 == "" || Roll2 == "") {
        return "";
    }

    if (Roll1 == "x") {
        ThisTotal += 10;
    } else if (Roll1 == "-") {
        ThisTotal += 0;
    } else {
        ThisTotal += parseInt(Roll1);
    }

    if (Roll2 == "x") {
        ThisTotal += 10;
    } else if (Roll2 == "/") {
        ThisTotal = 10;
    } else if (Roll2 == "-") {
        ThisTotal += 0;
    } else {
        ThisTotal += parseInt(Roll2);
        if (ThisTotal == 10) {
            var Roll2 = Frames[9].set_BottomFrame("/");
            BuildTable();
        } else if (ThisTotal > 10) {
            Frames[9].set_BottomFrame("");
            FrameNum--;
            document.getElementById("lblQuestion").innerHTML = "Frame 10 Roll 2:";
            BuildTable();
            return ""
        }
    }

    if (Roll1 == "x" || Roll2 == "/") {
        if (Roll3 == "") {
            return "";
        }
        if (Roll3 == "x") {
            ThisTotal += 10;
        } else if (Roll3 == "/") {
            ThisTotal += parseInt(10 - parseInt(Roll2));
        } else if (Roll3 == "-") {
            ThisTotal += 0;
        } else {
            ThisTotal += parseInt(Roll3);
        }

    }
    Total += ThisTotal;
    return Total;
}

function CalculateStrike(Number) {
    var ThisTotal = 10;
    var Roll1 = Frames[Number + 1].get_TopFrame();
    var Roll2 = Frames[Number + 1].get_BottomFrame();
    if (Roll1 == "-") { Roll1 = 0; }
    if (Roll2 == "-") { Roll2 = 0; }
    if (Roll1.toString() == "") {
        return "";
    } else if (Roll1 == "x") {
        ThisTotal += 10;
        if (Number + 1 < 9) {
            Roll2 = Frames[Number + 2].get_TopFrame();
        }
    } else {
        ThisTotal += parseInt(Roll1);
    }
    if (Roll2.toString() == "") {
        return "";
    } else if (Roll2 == "x") {
        ThisTotal += 10;
    } else if (Roll2 == "/") {
        ThisTotal += (10 - Roll1);
    } else {
        ThisTotal += parseInt(Roll2);
    }

    return ThisTotal;
}

function CalculateSpare(Number) {
    var ThisTotal = 10;
    var Roll1 = Frames[Number + 1].get_TopFrame();
    if (Roll1 == "-") { Roll1 = 0; }
    if (Roll1.toString() == "") {
        return "";
    } else if (Roll1 == "x") {
        ThisTotal += 10;
    } else {
        ThisTotal += parseInt(Roll1);
    }
    return ThisTotal;
}

function SetLabel(aName, aText) {
    document.getElementById(aName).innerHTML = aText;
}

function EndGame() {
    setAttribute("txtFrame", "class", "hideButton");
    setAttribute("lblDirections", "class", "hideButton");
    //setAttribute("lblQuestion", "class", "hideButton");
    setAttribute("btnGame", "class", "showButton");
    document.getElementById("lblQuestion").innerHTML = "Final Score: " + Total.toString();
}