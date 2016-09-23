#!/usr/bin/perl

use strict;
use warnings;
use List::Util 'reduce';
sub minindex { my @x=@_; reduce { $x[$a] < $x[$b] ? $a : $b } 0..$#_ }

if (scalar @ARGV < 2){
	print "\nparseDists_viva.pl <dist_matrix> <meta>\n\n";exit;
}

my %hasMeta;
my %meta;
my $ct = 0;
open F, $ARGV[1] or die;
while(<F>){
	my ($sample,$group,$shape,$hiv) = split /\s+/,$_;
	$meta{$sample}{'group'} = $group;
	$meta{$sample}{'shape'} = $shape;
	$meta{$sample}{'hiv'} = $hiv;
}
close F;


my %dists;
my @samples;
my $x=0;
my $i=0;
open F, $ARGV[0] or die;
while(<F>){
	chomp;
	$_ =~ s/\"//g;
	if ($x<1){
		$x++;
		@samples = split /\s+/,$_;
		next;
	}
	my ($sample,@dists) = split /\s+/,$_;
	$dists[$i]=10000;
	my $min = minindex @dists;
	$dists{$sample}{'neighbour'} = $samples[$min];
	$dists{$sample}{'dist'} = $dists[$min];
	print "$sample\t$samples[$min]\t$dists[$min]\n";
	$i++;
}
close(F);

my %samples;
my $count=0;
for(@samples){
	$samples{$_} = $count;
	$count++;
}

open OUT, ">data.json" or die;
my $nodeLine;
my $edgeLine;
my $numNodes = scalar %dists;
my $num = 0;
foreach my $sample (@samples) {

	$nodeLine .= "\t\t{\"id\": \"$sample\",\"group\":$meta{$sample}{'group'},\"hiv\":$meta{$sample}{'hiv'},\"type\":\"$meta{$sample}{'shape'}\"},\n";
	$edgeLine .= "\t\t{\"source\": $samples{$sample}, \"target\": $samples{$dists{$sample}{'neighbour'}},\"value\":$dists{$sample}{'dist'}},\n";
	$num++;
}

print OUT "var data = {\n\t\"graph\": [],\n\t\"nodes\":[\n";
print OUT substr($nodeLine,0,length($nodeLine)-2);
print OUT "],\n\t\"links\":[\n";
print OUT substr($edgeLine,0,length($edgeLine)-2);
print OUT "],\n\t\"directed\": false,\n\t\"multigraph\": false\n}";
