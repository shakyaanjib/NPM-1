/*! jQuery-Mobile-DateBox  |2014-10-03T17:22:04Z | (c) 2010,  2014 JTSage | https://github.com/jtsage/jquery-mobile-datebox/blob/master/LICENSE.txt */

!function(a){a.extend(a.mobile.datebox.prototype.options,{themeButton:"a",themeInput:"a",useSetButton:!0,validHours:!1,repButton:!0,durationStep:1,durationSteppers:{d:1,h:1,i:1,s:1}}),a.extend(a.mobile.datebox.prototype,{_dbox_run:function(){var a=this,b=this.drag,c=150;b.cnt>10&&(c=100),b.cnt>30&&(c=50),b.cnt>60&&(c=20),b.cnt>120&&(c=10),b.cnt>240&&(c=3),b.didRun=!0,b.cnt++,a._offset(b.target[0],b.target[1],!1),a._dbox_run_update(),a.runButton=setTimeout(function(){a._dbox_run()},c)},_dbox_fixstep:function(b){var c=this.options.durationSteppers,d=this.options.durationStep;a.inArray("s",b)>-1&&(c.i=1,c.s=d),a.inArray("i",b)>-1&&(c.h=1,c.s=d),a.inArray("h",b)>-1&&(c.d=1,c.s=d)},_dbox_run_update:function(b){var c=this,d=this.options,e=c.theDate.getTime()-c.initDate.getTime(),f="durationbox"===d.mode?!0:!1,g=c._dur(0>e?0:e);0>e&&(c.lastDuration=0,f&&c.theDate.setTime(c.initDate.getTime())),b!==!0&&f!==!0&&(c._check(),"datebox"===d.mode&&c.d.intHTML.find(".ui-datebox-header").find("h4").text(c._formatter(c.__("headerFormat"),c.theDate)),d.useSetButton&&(c.dateOK===!1?c.setBut.addClass("ui-state-disabled"):c.setBut.removeClass("ui-state-disabled"))),c.d.divIn.find("input").each(function(){switch(a(this).data("field")){case"y":a(this).val(c.theDate.get(0));break;case"m":a(this).val(c.theDate.get(1)+1);break;case"d":a(this).val(f?g[0]:c.theDate.get(2));break;case"h":a(this).val(f?g[1]:12===c.__("timeFormat")?c.theDate.get12hr():c.theDate.get(3));break;case"i":a(this).val(f?g[2]:c._zPad(c.theDate.get(4)));break;case"M":a(this).val(c.__("monthsOfYearShort")[c.theDate.get(1)]);break;case"a":a(this).val(c.__("meridiem")[c.theDate.get(3)>11?1:0]);break;case"s":a(this).val(g[3])}}),c.__("useArabicIndic")===!0&&c._doIndic()},_dbox_vhour:function(b){var c,d=this,e=this.options,f=[25,0],g=[25,0];return e.validHours===!1?!0:a.inArray(d.theDate.getHours(),e.validHours)>-1?!0:(c=d.theDate.getHours(),a.each(e.validHours,function(){(this>c?1:-1)===b?f[0]>Math.abs(this-c)&&(f=[Math.abs(this-c),parseInt(this,10)]):g[0]>Math.abs(this-c)&&(g=[Math.abs(this-c),parseInt(this,10)])}),void d.theDate.setHours(0!==f[1]?f[1]:g[1]))},_dbox_enter:function(b){var c,d=this,e=0;if("M"===b.data("field")&&(c=a.inArray(b.val(),d.__("monthsOfYearShort")),c>-1&&d.theDate.setMonth(c)),""!==b.val()&&0===b.val().toString().search(/^[0-9]+$/))switch(b.data("field")){case"y":d.theDate.setD(0,parseInt(b.val(),10));break;case"m":d.theDate.setD(1,parseInt(b.val(),10)-1);break;case"d":d.theDate.setD(2,parseInt(b.val(),10)),e+=86400*parseInt(b.val(),10);break;case"h":d.theDate.setD(3,parseInt(b.val(),10)),e+=3600*parseInt(b.val(),10);break;case"i":d.theDate.setD(4,parseInt(b.val(),10)),e+=60*parseInt(b.val(),10);break;case"s":e+=parseInt(b.val(),10)}"durationbox"===this.options.mode&&d.theDate.setTime(d.initDate.getTime()+1e3*e),d.refresh()}}),a.extend(a.mobile.datebox.prototype._build,{timebox:function(){this._build.datebox.apply(this,[])},durationbox:function(){this._build.datebox.apply(this,[])},datebox:function(){var b,c,d,e,f=this,g=this.drag,h=this.options,i="durationbox"===h.mode?!0:!1,j=-2,k="ui-datebox-",l=a("<div>"),m=a("<fieldset>"),n=l.clone(),o=m.clone(),p=l.clone(),q=a("<div><input type='text'></div>").addClass("ui-input-text ui-body-"+h.themeInput+" ui-corner-all ui-mini ui-shadow-inset"),r=a("<div></div>"),s="ui-btn-inline ui-link ui-btn ui-btn-"+h.themeButton+" ui-btn-icon-notext ui-shadow ui-corner-all";for("boolean"!=typeof f.d.intHTML&&f.d.intHTML.empty().remove(),f.d.headerText=f._grabLabel()!==!1?f._grabLabel():f.__("datebox"===h.mode?"titleDateDialogLabel":"titleTimeDialogLabel"),f.d.intHTML=a("<span>"),f.fldOrder=f.__("datebox"===h.mode?"dateFieldOrder":i?"durationOrder":"timeFieldOrder"),i?(f.dateOK=!0,f._dbox_fixstep(f.fldOrder)):(f._check(),f._minStepFix(),f._dbox_vhour("undefined"!=typeof f._dbox_delta?f._dbox_delta:1)),"datebox"===h.mode&&a("<div class='"+k+"header'><h4>"+f._formatter(f.__("headerFormat"),f.theDate)+"</h4></div>").appendTo(f.d.intHTML),c=0;c<f.fldOrder.length;c++)e=f._gridblk.b[c],b=i?h.durationSteppers[f.fldOrder[c]]:"i"===f.fldOrder[c]?h.minuteStep:1,("a"!==f.fldOrder[c]||12===f.__("timeFormat"))&&(a("<div>").append(i?"<label>"+f.__("durationLabel")[c]+"</label>":"").addClass("ui-block-"+e).appendTo(p),a("<div>").append(f._makeEl(q,{attr:{field:f.fldOrder[c],amount:b}})).addClass("ui-block-"+e).appendTo(n).find("input").data({field:f.fldOrder[c],amount:b}),f._makeEl(r,{attr:{field:f.fldOrder[c],amount:b}}).addClass(k+"cbut ui-block-"+e+" ui-icon-plus "+s).appendTo(m).prepend(i?"<label>"+f.__("durationLabel")[c]+"</label>":""),f._makeEl(r,{attr:{field:f.fldOrder[c],amount:-1*b}}).addClass(k+"cbut ui-block-"+e+" ui-icon-minus "+s).appendTo(o),j++);i&&p.addClass("ui-datebox-dboxlab ui-grid-"+f._gridblk.b[j]).appendTo(f.d.intHTML),m.addClass("ui-grid-"+f._gridblk.b[j]).appendTo(f.d.intHTML),n.addClass("ui-datebox-dboxin ui-grid-"+f._gridblk.b[j]).appendTo(f.d.intHTML),o.addClass("ui-grid-"+f._gridblk.b[j]).appendTo(f.d.intHTML),f.d.divIn=n,f._dbox_run_update(!0),f.dateOK!==!0?n.find("input").addClass("ui-state-disable"):n.find(".ui-state-disable").removeClass("ui-state-disable"),(h.useSetButton||h.useClearButton)&&(d=a("<div>",{"class":k+"controls"}),h.useSetButton&&(f.setBut=f._stdBtn.close.apply(f,[f.__("datebox"===h.mode?"setDateButtonLabel":i?"setDurationButtonLabel":"setTimeButtonLabel")]),f.setBut.appendTo(d)),h.useClearButton&&d.append(f._stdBtn.clear.apply(f)),h.useCollapsedBut?(d.controlgroup({type:"horizontal"}),d.addClass("ui-datebox-collapse")):d.controlgroup(),d.appendTo(f.d.intHTML)),h.repButton||f.d.intHTML.on(h.clickEvent,"."+k+"cbut",function(b){n.find(":focus").blur(),b.preventDefault(),f._dbox_delta=a(this).data("amount")>1?1:-1,f._offset(a(this).data("field"),a(this).data("amount"))}),n.on("change","input",function(){f._dbox_enter(a(this))}),f.wheelExists&&n.on("mousewheel","input",function(b,c){b.preventDefault(),f._dbox_delta=0>c?-1:1,f._offset(a(this).data("field"),(0>c?-1:1)*a(this).data("amount"))}),h.repButton&&(f.d.intHTML.on(g.eStart,"."+k+"cbut",function(){n.find(":focus").blur(),e=[a(this).data("field"),a(this).data("amount")],g.move=!0,g.cnt=0,f._dbox_delta=a(this).data("amount")>1?1:-1,f._offset(e[0],e[1],!1),f._dbox_run_update(),f.runButton||(g.target=e,f.runButton=setTimeout(function(){f._dbox_run()},500))}),f.d.intHTML.on(g.eEndA,"."+k+"cbut",function(a){g.move&&(a.preventDefault(),clearTimeout(f.runButton),f.runButton=!1,g.move=!1)}))}})}(jQuery);
//# sourceMappingURL=jqm-datebox.mode.datebox.min.js.map