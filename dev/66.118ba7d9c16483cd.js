(self.webpackChunkawg_app=self.webpackChunkawg_app||[]).push([[66],{2066:(d,p,t)=>{"use strict";t.r(p),t.d(p,{EditionIntroModule:()=>m});var i=t(1635),o=t(4438),r=t(9584),l=t(4308);var I=t(6101),E=t.n(I),R=t(983),f=t(5558),C=t(9437),x=t(444),O=t(5110),h=t(7773);let s=class{constructor(n,e,a,u){this.editionDataService=n,this.editionService=e,this.router=a,this.utils=u,this.errorObject=null,this.ref=this}get editionRouteConstants(){return O.vD}ngOnInit(){this.getEditionIntroData()}getEditionIntroData(){this.editionIntroData$=this.editionService.getEditionComplex().pipe((0,f.n)(n=>(this.editionComplex=n,this.editionDataService.getEditionIntroData(this.editionComplex))),(0,C.W)(n=>(this.errorObject=n,R.w)))}navigateToIntroFragment(n){this._navigateToFragment(this.editionRouteConstants.EDITION_INTRO.route,n)}navigateToReportFragment(n){this._navigateToFragment(this.editionRouteConstants.EDITION_REPORT.route,n)}openModal(n){n&&this.modal.open(n)}selectSvgSheet(n,e){const a=n?`/edition/complex/${n}/`:this.editionComplex.baseRoute,y={queryParams:{id:e??""},queryParamsHandling:""};this.router.navigate([a,this.editionRouteConstants.EDITION_SHEETS.route],y)}_navigateToFragment(n,e){e||(e="");const a={fragment:e};this.router.navigate([this.editionComplex.baseRoute,n],a)}static#t=this.ctorParameters=()=>[{type:h.U7},{type:h.s9},{type:l.Ix},{type:x.QY}];static#n=this.propDecorators={modal:[{type:o.Uct,args:["modal",{static:!0}]}]}};s=(0,i.Cg)([(0,o.uAl)({selector:"awg-intro",template:'\x3c!-- content: intro --\x3e\n<div>\n    \x3c!-- modal --\x3e\n    <awg-modal #modal></awg-modal>\n\n    \x3c!-- intro --\x3e\n    @if (editionIntroData$ | async; as editionIntroData) {\n        <div class="awg-intro-view p-5 border rounded-3">\n            @if (utils.isNotEmptyArray(editionIntroData.intro[0].content)) {\n                @for (introParagraph of editionIntroData.intro[0].content; track introParagraph) {\n                    <p class="awg-intro-paragraph" [compile-html]="introParagraph" [compile-html-ref]="this"></p>\n                }\n            } @else {\n                <p class="awg-intro-empty">\n                    <small class="text-muted"\n                        >[Die Einleitung zum Editionskomplex\n                        <span [innerHTML]="editionComplex.complexId.full"></span> erscheint im Zusammenhang der\n                        vollsta\u0308ndigen Edition von {{ editionComplex.complexId.short }} in\n                        {{ editionRouteConstants.EDITION.short }} {{ editionComplex.series.short }}/{{\n                            editionComplex.section.short\n                        }}.]\n                    </small>\n                </p>\n            }\n            @if (utils.isNotEmptyArray(editionIntroData.intro[0].footnotes)) {\n                <hr />\n                <h5>Anmerkungen</h5>\n                @for (footnote of editionIntroData.intro[0].footnotes; track footnote) {\n                    <small\n                        ><p class="awg-intro-footnote" [compile-html]="footnote" [compile-html-ref]="this"></p\n                    ></small>\n                }\n            }\n        </div>\n    } @else {\n        \x3c!-- error message --\x3e\n        @if (errorObject) {\n            <div class="errorMessage">\n                <div class="col-12 text-center">\n                    <div class="alert alert-danger">\n                        {{ errorObject }}\n                    </div>\n                </div>\n            </div>\n        }\n    }\n</div>\n',changeDetection:o.Ngq.OnPush,styles:[E()]})],s);const D=[{path:"",component:s,data:{title:"AWG Online Edition \u2013 Intro"}}],T=[s];let g=class{};g=(0,i.Cg)([(0,o.UQu)({imports:[l.iI.forChild(D)],exports:[l.iI]})],g);let m=class{};m=(0,i.Cg)([(0,o.UQu)({imports:[r.G,g],declarations:[T]})],m)},6101:(d,p,t)=>{var i=t(8564),r=t(8557)(i);r.push([d.id,"p.awg-intro-paragraph {\n  margin: 0;\n  text-indent: 25px;\n}\np.awg-intro-paragraph::ng-deep .heading {\n  display: block;\n  margin-bottom: 25px;\n  font-size: 1.5em;\n  font-weight: bold;\n}\np.awg-intro-paragraph::ng-deep .heading,\np.awg-intro-paragraph::ng-deep .small,\np.awg-intro-paragraph::ng-deep .no-indent {\n  text-indent: 0;\n}\np.awg-intro-paragraph::ng-deep .small:not(.spacebreak),\np.awg-intro-paragraph::ng-deep .no-indent {\n  margin-left: -25px;\n}\np.awg-intro-paragraph::ng-deep .spacebreak {\n  display: block;\n  margin-bottom: 25px;\n}\np.awg-intro-paragraph::ng-deep .spacebreak.no-indent {\n  margin-left: 0;\n}",""]),d.exports=r.toString()}}]);